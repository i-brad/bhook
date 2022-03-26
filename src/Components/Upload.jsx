import { Formik, Form, Field, ErrorMessage } from "formik";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import * as Yup from "yup";
import { isUploadOnState } from "../State_Atoms";
import { useRecoilState } from "recoil";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDoc, doc, collection } from "firebase/firestore";

function Upload() {
  let [isUploadOn, setUploadOn] = useRecoilState(isUploadOnState);
  let [Image, setImage] = useState([]);
  let [File, setFile] = useState([]);
  let [keywords, setKeywords] = useState([]);
  let [err, setErr] = useState("");
  let [FileError, setFileError] = useState("");
  const [error, setError] = useState("");
  const [isUploaded, setIsUploaded] = useState(false)

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
        if (Image[0].size <= 1048576) {
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
          setImage([]);:
          setErr("File is too large. Max of an 1MB");
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
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        setError("Failed to upload");
        console.error(err);
      });

    let bookRef = doc(collection(db, "books"));

    await setDoc(bookRef, {
      title: book.title,
      description: book.description,
      new: true,
      keywords,
      tags: [...book.tags],
      imageURL,
      fileURL,
      likes: 0,
      reviews: 0,
    });
    //console.log("here");
setIsUploaded(true);
setUploadOn(false);
setTimeout(() =>{
setIsUploaded(false)
}, 1000)
  };

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
        className="absolute top-3 right-5 md:right-10 text-accent z-20 w-10 h-auto hover:bg-green-100 rounded p-1"
      >
        <CloseIcon />
      </button>
      <h3 className="text-accent mb-5 text-xl">Upload a book</h3>
      <Formik
        initialValues={{
          title: "",
          description: "",
          tags: "",
        }}
        validationSchema={Yup.object({
          title: Yup.string()
            .max(30, "Must be 30 characters or less")
            .required("Required"),
          description: Yup.string()
            .min(10, "Must be 10 characters or less")
            .required("Required"),
          tags: Yup.string()
            .min(5, "Must be 5 characters or less")
            .required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          if (!Image.length) {
            setErr("File required");

            return false;
          }
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
            description: values.description,
            image: Image[0],
            file: File[0],
          };

          uploadBook(book);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-full m-auto text-accent">
            <label htmlFor="name" className="font-medium">
              Book title
            </label>
            <Field
              type="text"
              name="title"
              id="title"
              placeholder="Enter name of book"
              className="block w-full px-3 py-2 rounded-md mb-3 mt-1 border-current border-2 outline-none"
              required
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-red-500 -mt-1 text-xs mb-3"
            />
            <label htmlFor="description" className="font-medium">
              Book description
            </label>
            <Field
              type="text"
              name="description"
              placeholder="Enter book description"
              className="block w-full h-24 px-3 py-2 rounded-md mb-3 mt-1 border-current border-2 outline-none"
              component="textarea"
              id="description"
              required
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 -mt-1 text-xs mb-3"
            />
            <label className="font-medium">Upload book image(max 1MB)</label>
            {Image && (
              <p className="text-sm mb-3">
                <span className="font-medium">Image:</span> {Image[0]?.name}
              </p>
            )}
            <div
              onDrop={photoDrop}
              onDragOver={filesPresence}
              onDragEnd={endDrag}
              onDragLeave={endDrag}
              className="relative flex justify-between items-center flex-col w-full px-3 py-2 rounded-md mb-3 mt-1 border-current border-2 outline-none"
            >
              <Field
                type="file"
                name="image"
                className="cursor-pointer hidden"
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
                className="cursor-pointer font-medium text-sm"
              >
                Browse files
              </label>
              <img
                src=""
                alt=""
                className=" w-auto h-auto object-center object-contain mt-2"
                id="img"
              />
            </div>
            <ErrorMessage
              name="image"
              component="div"
              className="text-red-500 -mt-1 text-xs mb-3"
            />
            {err && <p className="text-red-500 -mt-1 text-xs mb-3">{err}</p>}
            <label className="font-medium">Upload book pdf file</label>
            {File && (
              <p className="text-sm mb-3">
                <span className="font-medium">Book:</span> {File[0]?.name}
              </p>
            )}
            <div
              onDrop={fileDrop}
              onDragOver={filesPresence}
              onDragEnd={endDrag}
              onDragLeave={endDrag}
              className="relative flex justify-between items-center flex-col w-full px-3 py-2 rounded-md mb-3 mt-1 border-current border-2 outline-none"
            >
              <Field
                type="file"
                name="file"
                className="cursor-pointer hidden"
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
                className="cursor-pointer font-medium text-sm"
              >
                Browse files
              </label>
            </div>
            <ErrorMessage
              name="file"
              component="div"
              className="text-red-500 -mt-1 text-xs mb-3"
            />
            {FileError && (
              <p className="text-red-500 -mt-1 text-xs mb-3">{FileError}</p>
            )}
            <label htmlFor="tags" className="font-medium">
              Tags (separate with comma (,))
            </label>
            <Field
              type="text"
              name="tags"
              id="tags"
              placeholder="tags (book's focus) like fiction, africa, ...etc"
              className="block w-full px-3 py-2 rounded-md mb-3 mt-1 border-current border-2 outline-none"
              required
            />
            <ErrorMessage
              name="tags"
              component="div"
              className="text-red-500 -mt-1 text-xs mb-3"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-accent ${isSubmitting? "opacity-100" : "opacity-50"} rounded-3xl text-white px-4 py-2 flex justify-between items-center mt-5 mx-auto`}
            >
              <CloudUploadOutlinedIcon className="mr-1" />
              Upload
            </button>
          </Form>
        )}
      </Formik>
{isUploaded && <p classmate="absolute top-5 left-0 text-accent bg-green-100 rounded-3xl text-sm text-center w-full h-auto p-3">Book Uploaded successfully uploaded</p>}
    </div>
  );
}

export default Upload;
