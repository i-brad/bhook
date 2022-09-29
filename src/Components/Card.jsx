import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import { collection, doc, increment, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { db } from "../firebase";
import {
  isBookSelectedState,
  isReviewingState,
  isSearchOnState,
} from "../State_Atoms";

function Card({ data }) {
  let {
    title,
    imageURL,
    tags,
    likes,
    reviews,
    description,
    id,
    author = "Bhook",
  } = data;

  let navigate = useNavigate();
  let [Likes, setLikes] = useState(likes);
  const setIsBookSelected = useSetRecoilState(isBookSelectedState);
  const setIsReviewing = useSetRecoilState(isReviewingState);
  let setSearchOn = useSetRecoilState(isSearchOnState);

  let [liking, setLiking] = useState(false);

  const handle = () => {
    setIsBookSelected(true);
    setSearchOn(false);
  };

  const reviewHandle = () => {
    navigate(`/#${title}-${id}`);
    setIsBookSelected(true);
    setIsReviewing(true);
    setSearchOn(false);
  };

  useEffect(() => {
    if (liking) {
      let dbRef = collection(db, "books");
      let bookRef = doc(dbRef, id);

      updateDoc(bookRef, {
        likes: increment(1),
      })
        .then(() => {
          setLikes((curr) => curr + 1);
          setLiking(false);
        })
        .catch((err) => {
          console.error(err);
          setLiking(false);
        });
    }
  }, [id, liking]);

  return (
    <div className="flex justify-start items-start min-w-[300px] max-w-[500px] min-h-48 my-4 mr-10">
      <img
        src={imageURL || `./images/a.jpg`}
        alt={title}
        className="object-cover object-center w-32 h-full mr-4"
      />
      <div className="flex flex-col justify-between w-full h-full align-start">
        <div className="w-full h-full">
          <Link
            to={`#${title}-${id}`}
            className="block mb-2 text-lg font-medium underline capitalize"
            onClick={handle}
          >
            {title}
          </Link>
          <p className="w-full text-xs md:text-sm">{description}</p>
          <p className="w-full mt-3 text-xs md:text-sm">Author: {author}</p>
          {tags.length > 0 && (
            <span className="flex flex-wrap items-center justify-start w-full mt-2">
              {tags.map((tag, index) => {
                return (
                  <Link
                    to="/"
                    className="p-1 m-1 text-xs bg-green-100 rounded-sm whitespacing-nowrap"
                    key={index}
                  >
                    #{tag}
                  </Link>
                );
              })}
            </span>
          )}
        </div>
        <span className="flex items-center justify-between w-full mt-3">
          <button
            className="text-xs cursor-pointer md:text-sm"
            onClick={() => setLiking(true)}
          >
            <span className="inline-flex items-center justify-start mr-1">
              {Likes}
              {liking ? (
                <div className="w-4 h-4 ml-1 transition-all border-2 border-[#086972] rounded-full animate-spin border-l-transparent"></div>
              ) : (
                <FavoriteBorderIcon className="md:ml-1" />
              )}
            </span>
            Likes
          </button>
          <button
            className="text-xs cursor-pointer md:text-sm"
            onClick={reviewHandle}
          >
            <span className="inline-flex items-center justify-start mr-1">
              {reviews}
              <RateReviewOutlinedIcon className="md:ml-1" />
            </span>
            Reviews
          </button>
        </span>
      </div>
    </div>
  );
}

export default Card;
