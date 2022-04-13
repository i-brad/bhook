import { useRecoilState, useRecoilValue } from "recoil";
import {
  isBookSelectedState,
  bookState,
  isReviewingState,
  reviewState,
} from "../State_Atoms";
import { useLocation } from "react-router-dom";
import { Card } from "../Components";
import Review from "./Review";
import CloseIcon from "@mui/icons-material/Close";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  doc,
  collection,
  Timestamp,
  setDoc,
  updateDoc,
  orderBy,
  query,
  getDocs,
  increment,
} from "firebase/firestore";

function Book() {
  let [isReview, setIsReview] = useRecoilState(isReviewingState);
  let hash = useLocation().hash.replace("#", "").replace(/%20/g, " ");
  let id = hash.split("-")[1];
  let [isBookSelected, setIsBookSelected] = useRecoilState(isBookSelectedState);
  let allBooks = useRecoilValue(bookState);
  let [reviews, setReviews] = useRecoilState(reviewState);
  const [reviewSent, setReviewSent] = useState(false);
  const [sending, setSending] = useState(false);

  let [initial, setInitial] = useState(hash ? true : false);

  let [book, setBook] = useState([]);

  useEffect(() => {
    if (isBookSelected || initial) {
      let item = allBooks.filter((item) => item.id === id);
      const dbRef = collection(db, "books");
      let bookRef = doc(dbRef, id);
      let reviewRef = collection(bookRef, "reviews");
      async function getReviews() {
        let q = query(reviewRef, orderBy("date"));

        const querySnapshot = await getDocs(q);
        let reviews = [];
        querySnapshot.forEach((doc) => {
          reviews.push({ id: doc.id, ...doc.data() });
        });

        setReviews(reviews);
      }

      getReviews();
      setBook(item);
    }
  }, [id, isBookSelected, allBooks, setReviews, initial]);
  let closeBookModal = () => {
    setIsBookSelected(false);
    setInitial(false);
  };

  let closeReviewModal = () => {
    setIsReview(false);
  };

  let openReviewModal = () => {
    setIsReview(true);
  };

  const submitReview = async (values) => {
    setSending(true);
    let dbRef = collection(db, "books");
    let bookRef = doc(dbRef, id);
    let reviewRef = collection(bookRef, "reviews");

    await updateDoc(bookRef, {
      reviews: increment(1),
    });

    setDoc(doc(reviewRef), {
      name: values.name,
      review: values.review,
      date: Timestamp.now(),
    })
      .then(() => {
        setSending(false);
        setReviewSent(true);
        setIsReview(false);
        setTimeout(() => {
          setReviewSent(false);
        }, 1500);
      })
      .catch((err) => console.error(err));

    //setReviewSent(true);
    //setIsReview(false);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 bg-white w-full h-[90vh] shadow-inner overflow-auto z-50 transition-transform duration-500 ${
        isBookSelected || initial ? "translate-y-[0]" : "translate-y-[1000px]"
      }`}
    >
      <span className="absolute top-3 right-5 md:right-10 z-40 text-accent flex justify-between items-center">
        <button className="mr-1 w-10 h-auto hover:bg-green-100 rounded p-1">
          <RateReviewOutlinedIcon onClick={openReviewModal} />
        </button>
        <button
          onClick={closeBookModal}
          className="w-10 h-auto hover:bg-green-100 rounded p-1"
        >
          <CloseIcon />
        </button>
      </span>
      <div className="relative p-5 pt-16 md:pt-0 md:px-10 text-accent h-auto w-full">
        <h1 className="font-medium text-xl mb-5">
          About{" "}
          <em className="text-2xl capitalize">
            <q>{hash.split("-")[0]}</q>
          </em>
        </h1>
        {book.length > 0 && (
          <>
            {book.map((details) => {
              return <Card data={details} key={details.id} />;
            })}
            <span className="block my-10">
              {/* <Link
                to={`/reading/${hash}`}
                className="px-5 py-2 bg-accent text-white rounded-3xl text-sm inline-flex justify-between items-center mr-2"
                onClick={closeBookModal}
              >
                <AutoStoriesOutlinedIcon className="mr-1" /> Read
              </Link> */}
              {/* <a
                href={book[0]?.fileURL || "/"}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 bg-accent text-white rounded-3xl text-sm inline-flex justify-between items-center mr-2"
                onClick={closeBookModal}
              >
                <AutoStoriesOutlinedIcon className="mr-1" /> Read
              </a> */}
              <a
                href={book[0]?.fileURL || "/"}
                downnload
                className="px-5 py-2 text-sm inline-flex justify-between items-center hover:bg-green-100 rounded-3xl"
              >
                <DownloadOutlinedIcon className="mr-1" />
                Download now
              </a>
            </span>
          </>
        )}

        {reviews.length > 0 && (
          <div>
            <h1 className="font-medium text-lg mb-4">
              Reviews ({reviews.length})
            </h1>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(0,500px))] md:grid-cols-[repeat(auto-fit,minmax(0,300px))] gap-3 place-content-start">
              {reviews.map((review) => {
                return <Review key={review.id} data={review} />;
              })}
            </div>
          </div>
        )}
        {book.length > 0 && (
          <button
            onClick={openReviewModal}
            className="block text-sm mt-8 border-current border-2 px-3 py-2 rounded-3xl mr-0 ml-auto hover:bg-[#086972] hover:text-white transition-all"
          >
            <RateReviewOutlinedIcon className="mr-1" />
            Write a review
          </button>
        )}
        <Formik
          initialValues={{ name: "", review: "" }}
          validationSchema={Yup.object({
            name: Yup.string()
              .min(3, "Must be an actual name")
              .required("Required"),
            review: Yup.string()
              .min(10, "Must be 10 characters or less")
              .required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            submitReview(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form
              className={`fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 w-full md:w-3/6 lg:w-1/3 m-auto shadow-md text-accent rounded-md bg-white px-5 py-2 transition-all ${
                isReview ? "scale-100" : "scale-0"
              }`}
            >
              <button
                onClick={closeReviewModal}
                className="absolute top-0 right-5 md:right-10 w-10 h-auto hover:bg-green-100 rounded p-1"
              >
                <CloseIcon />
              </button>
              <label htmlFor="review" className="font-medium">
                Name
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name"
                className="block w-full px-3 py-2 rounded-md border-current border-2 outline-none mt-2 mb-3"
                required
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 mt-1 text-xs mb-3"
              />
              <label htmlFor="review" className="font-medium">
                Write a review
              </label>
              <Field
                type="text"
                name="review"
                id="review"
                placeholder="Write...."
                className="block w-full h-28 px-3 py-2 rounded-md border-current border-2 outline-none mt-2"
                component="textarea"
                required
              />
              <ErrorMessage
                name="review"
                component="div"
                className="text-red-500 mt-1 text-xs mb-3"
              />
              <button
                type="submit"
                disabled={sending}
                className={`${
                  sending ? "opacity-50" : "opacity-100"
                } flex justify-between items-center bg-accent rounded-3xl text-white px-4 py-2 mt-3 mx-auto`}
              >
                <RateReviewOutlinedIcon className="mr-1" />
                {sending ? "Sending" : "Send"}
              </button>
            </Form>
          )}
        </Formik>
        {reviewSent && (
          <p className="fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 w-full md:w-3/6 lg:w-1/3 m-auto bg-green-100 rounded-3xl p-3 text-center min-h-8">
            Review has been successfully submitted
          </p>
        )}
      </div>
    </div>
  );
}

export default Book;
