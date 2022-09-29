import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import * as Yup from "yup";
import { db, storage } from "../firebase";
import { isUploadOnState } from "../State_Atoms";

function Upload() {
  let [isUploadOn, setUploadOn] = useRecoilState(isUploadOnState);
  let [Image, setImage] = useState([]);
  let [File, setFile] = useState([]);
  let [book, setBook] = useState({});
  let [keywords, setKeywords] = useState([]);
  let [err, setErr] = useState("");
  let [FileError, setFileError] = useState("");
  const [error, setError] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  let [imageURL, setImageURL] = useState("");
  let [fileURL, setFileURL] = useState("");
  const closeUploadModal = () => {
    setUploadOn(false);
  };

  const photoDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove("bg-green-100");

    let dt = e.dataTransfer;
    let image = dt.files;

    handleImage(image);
  };

  const fileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove("bg-green-100");

    let dt = e.dataTransfer;
    let file = dt.files;

    handleFile(file);
  };

  const handleImage = (image) => {
    //console.log(image);
    setImage([...image]);
  };

  const handleFile = (file) => {
    if (/^application\/pdf/.test(file[0].type)) {
      setFile([...file]);
    } else {
      setFileError("must be a pdf file");
    }
  };

  useEffect(() => {
    if (Image.length) {
      let reg = /^image/;
      if (reg.test(Image[0].type)) {
        if (Image[0].size <= 2097152) {
          const previewImage = (image) => {
            let reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onloadend = () => {
              let img = document.getElementById("img");
              img.src = reader.result;
            };
          };
          [...Image].forEach(previewImage);
        } else {
          setImage([]);
          setErr("File is too large. Max of an 2MB");
          setTimeout(() => {
            setErr("");
          }, 5000);
        }
      } else {
        setErr("File must be an image");
        setTimeout(() => {
          setErr("");
        }, 5000);
      }
    }
  }, [Image]);

  const uploadBook = async (book) => {
    setIsUploading(true);
    const imageRef = ref(storage, `images/${book.image.name}`);
    const fileRef = ref(storage, `pdfs/${book.file.name}`);
    await uploadBytes(imageRef, book.image)
      .then((snapshot) => {
        let imgRef = ref(storage, snapshot.metadata.fullPath);
        getDownloadURL(imgRef)
          .then(async (url) => {
            setImageURL(url);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        setError("Failed to upload");
        console.error(err);
      });

    await uploadBytes(fileRef, book.file)
      .then((snapshot) => {
        let fRef = ref(storage, snapshot.metadata.fullPath);
        getDownloadURL(fRef)
          .then(async (url) => {
            setFileURL(url);
            uploadReadyBook();
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        setError("Failed to upload");
        console.error(err);
      });
    setBook(book);
  };

  async function uploadReadyBook() {
    let bookRef = doc(collection(db, "books"));
    await setDoc(bookRef, {
      title: book.title,
      author: book.author,
      description: book.description,
      keywords,
      tags: [...book.tags],
      imageURL,
      fileURL,
      likes: 0,
      reviews: 0,
    });

    setIsUploaded(true);
    setIsUploading(false);
    setUploadOn(false);
    setBook({});
    setImage([]);
    setFile([]);
    setFileURL("");
    setImageURL("");
    setKeywords([]);
    setTimeout(() => {
      setIsUploaded(false);
    }, 1500);
  }

  const filesPresence = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.add("bg-green-100");
  };

  const endDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove("bg-green-100");
  };

  return (
    <div
      className={`fixed bottom-0 md:top-2/4 left-0 md:left-2/4 md:-translate-x-2/4 md:-translate-y-2/4 z-[100] bg-white shadow-lg md:rounded-2xl overflow-auto h-[90vh] md:min-h-56 w-full md:w-2/3 p-5 md:px-10 transition-transform duration-500 ${
        isUploadOn ? "translate-y-[0]" : "translate-y-[1000px!important]"
      }`}
    >
      <button
        onClick={closeUploadModal}
        className="absolute z-20 w-10 h-auto p-1 rounded top-3 right-5 md:right-10 text-accent hover:bg-green-100"
      >
        <CloseIcon />
      </button>
      <h3 className="mb-5 text-xl text-accent">Upload a book</h3>
      <Formik
        initialValues={{
          title: "",
          author: "",
          description: "",
          tags: "",
        }}
        validationSchema={Yup.object({
          title: Yup.string().required("Required"),
          author: Yup.string().required("Required"),
          description: Yup.string().required("Required"),
          tags: Yup.string().required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          if (!Image.length) {
            setErr("File required");
            return false;
          }
          // console.log(values);
          let tags = values.tags.toLowerCase().split(",");

          const splitWord = (value) => {
            value.split(" ").forEach((word) => {
              let words = [];
              let letter = "";
              word.split("").forEach((l) => {
                letter += l;
                words.push(letter);
              });
              setKeywords((currentKeywords) => [...currentKeywords, ...words]);
            });
          };
          splitWord(values.title.toLowerCase());

          const generateKeywords = (value) => {
            let words = [];
            let letter = "";
            value.split("").forEach((l) => {
              letter += l;
              words.push(letter);
            });

            setKeywords((currentKeywords) => [...currentKeywords, ...words]);
          };
          generateKeywords(values.title.toLowerCase());

          let book = {
            tags,
            title: values.title,
            author: values.author,
            description: values.description,
            image: Image[0],
            file: File[0],
          };

          uploadBook(book);
          setSubmitting(false);
        }}
      >
        {() => (
          <Form className="w-full m-auto text-accent">
            <label htmlFor="name" className="font-medium">
              Book title
            </label>
            <Field
              type="text"
              name="title"
              id="title"
              placeholder="Enter name of book"
              className="block w-full px-3 py-2 mt-1 mb-3 border-2 border-current rounded-md outline-none"
              required
            />
            <ErrorMessage
              name="title"
              component="div"
              className="mb-3 -mt-1 text-xs text-red-500"
            />
            <label htmlFor="name" className="font-medium">
              Book author
            </label>
            <Field
              type="text"
              name="author"
              id="author"
              placeholder="Enter author of book"
              className="block w-full px-3 py-2 mt-1 mb-3 border-2 border-current rounded-md outline-none"
              required
            />
            <ErrorMessage
              name="author"
              component="div"
              className="mb-3 -mt-1 text-xs text-red-500"
            />
            <label htmlFor="description" className="font-medium">
              Book description
            </label>
            <Field
              type="text"
              name="description"
              placeholder="Enter book description"
              className="block w-full h-24 px-3 py-2 mt-1 mb-3 border-2 border-current rounded-md outline-none"
              component="textarea"
              id="description"
              required
            />
            <ErrorMessage
              name="description"
              component="div"
              className="mb-3 -mt-1 text-xs text-red-500"
            />
            <label className="font-medium">Upload book image(max 1MB)</label>
            {Image && (
              <p className="mb-3 text-sm">
                <span className="font-medium">Image:</span>{" "}
                {Image[0]?.name || ""}
              </p>
            )}
            <div
              onDrop={photoDrop}
              onDragOver={filesPresence}
              onDragEnd={endDrag}
              onDragLeave={endDrag}
              className="relative flex flex-col items-center justify-between w-full px-3 py-2 mt-1 mb-3 border-2 border-current rounded-md outline-none"
            >
              <Field
                type="file"
                name="image"
                className="hidden cursor-pointer"
                id="image"
                accept="image/*"
                onChange={(e) => {
                  handleImage(e.target.files);
                }}
              />
              <h5>Drag and drop image</h5>
              <CloudUploadOutlinedIcon className="w-[5rem!important] h-[5rem!important]" />
              <label
                htmlFor="image"
                className="text-sm font-medium cursor-pointer"
              >
                Browse files
              </label>
              <img
                src=""
                alt=""
                className="object-contain object-center w-auto h-auto mt-2 "
                id="img"
              />
            </div>
            <ErrorMessage
              name="image"
              component="div"
              className="mb-3 -mt-1 text-xs text-red-500"
            />
            {err && <p className="mb-3 -mt-1 text-xs text-red-500">{err}</p>}
            <label className="font-medium">Upload book pdf file</label>
            {File && (
              <p className="mb-3 text-sm">
                <span className="font-medium">Book:</span> {File[0]?.name || ""}
              </p>
            )}
            <div
              onDrop={fileDrop}
              onDragOver={filesPresence}
              onDragEnd={endDrag}
              onDragLeave={endDrag}
              className="relative flex flex-col items-center justify-between w-full px-3 py-2 mt-1 mb-3 border-2 border-current rounded-md outline-none"
            >
              <Field
                type="file"
                name="file"
                className="hidden cursor-pointer"
                id="file"
                accept="application/pdf"
                onChange={(e) => {
                  handleFile(e.target.files);
                }}
              />
              <h5>Drag and drop pdf file</h5>
              <CloudUploadOutlinedIcon className="w-[5rem!important] h-[5rem!important]" />
              <label
                htmlFor="file"
                className="text-sm font-medium cursor-pointer"
              >
                Browse files
              </label>
            </div>
            <ErrorMessage
              name="file"
              component="div"
              className="mb-3 -mt-1 text-xs text-red-500"
            />
            {FileError && (
              <p className="mb-3 -mt-1 text-xs text-red-500">{FileError}</p>
            )}
            <label htmlFor="tags" className="font-medium">
              Tags (separate with commas)
            </label>
            <Field
              type="text"
              name="tags"
              id="tags"
              placeholder="tags (book's focus) like fiction, africa, ...etc"
              className="block w-full px-3 py-2 mt-1 mb-3 border-2 border-current rounded-md outline-none"
              required
            />
            <ErrorMessage
              name="tags"
              component="div"
              className="mb-3 -mt-1 text-xs text-red-500"
            />
            <button
              type="submit"
              disabled={Image.length > 0 ? (isUploading ? true : false) : true}
              className={`bg-accent ${
                Image.length > 0
                  ? isUploading
                    ? "opacity-50"
                    : "opacity-100"
                  : "opacity-50"
              } rounded-3xl text-white px-4 py-2 flex justify-between items-center mt-5 mx-auto`}
            >
              <CloudUploadOutlinedIcon className="mr-1" />
              {isUploading ? "Uploading" : "Upload"}
            </button>
          </Form>
        )}
      </Formik>
      {isUploaded && (
        <p className="absolute z-[200] top-0 left-0 text-accent bg-green-100 text-sm text-center w-full h-auto p-3">
          Boo successfully uploaded
        </p>
      )}
      {error && (
        <p className="absolute z-[200] top-0 left-0 text-red-800 bg-red-100 text-sm text-center w-full h-auto p-3">
          {error}
        </p>
      )}
    </div>
  );
}

export default Upload;
