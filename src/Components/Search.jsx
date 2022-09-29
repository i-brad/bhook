import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
//import { Link } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Card } from "../Components";
import { db } from "../firebase";
import { isSearchOnState, isUploadOnState } from "../State_Atoms";

function Search() {
  let [isSearchOn, setSearchOn] = useRecoilState(isSearchOnState);
  let [searchTerm, setSearchTerm] = useState("");
  let [results, setResults] = useState([]);
  let closeSearchModal = () => {
    setSearchOn(!isSearchOn);
  };

  let [searching, setSearching] = useState(false);

  let setUploadOn = useSetRecoilState(isUploadOnState);

  let openUploadModal = () => {
    setUploadOn(true);
  };

  useEffect(() => {
    async function getResult() {
      let booksRef = collection(db, "books");

      let q = query(
        booksRef,
        where("keywords", "array-contains", `${searchTerm.toLowerCase()}`),
        orderBy("title")
      );

      let resultsArr = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        resultsArr.push({ id: doc.id, ...doc.data() });
      });

      setResults(resultsArr);
      setSearching(false);
    }
    getResult();
  }, [searchTerm]);

  return (
    <div
      className={`fixed bottom-0 md:top-2/4 left-0 md:left-2/4 md:-translate-x-2/4 md:-translate-y-2/4 z-[100] bg-white md:rounded-2xl overflow-auto h-[90vh] md:min-h-56 w-full md:w-2/3 p-5 pt-0 md:px-10 transition-transform duration-500 ${
        isSearchOn ? "translate-y-[0]" : "translate-y-[1000px!important]"
      }`}
    >
      <button
        onClick={closeSearchModal}
        className="absolute z-20 w-10 h-auto p-1 rounded top-3 right-5 md:right-10 text-accent hover:bg-green-100"
      >
        <CloseIcon />
      </button>
      <form className="sticky top-0 z-10 flex items-center justify-start w-full h-auto mb-5 bg-white border-b-2 border-b-slate-300">
        <button type="submit">
          <SearchOutlinedIcon className="text-accent" />
        </button>
        <input
          type="text"
          name="search"
          placeholder="Search...."
          className="flex-1 px-3 py-4 border-none outline-none"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSearching(true);
          }}
        />
      </form>
      <p className="block mt-10 text-accent">
        <button className="font-medium underline" onClick={openUploadModal}>
          Upload
        </button>{" "}
        a book for others to read.
      </p>
      {searching && (
        <div className="w-6 h-6 mx-auto my-5 transition-all border-2 border-[#086972] rounded-full animate-spin border-l-transparent"></div>
      )}
      {results.length > 0 && (
        <div className="w-full h-auto mt-5 text-accent">
          <h4 className="font-medium">Search Results ({results.length})</h4>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(0,500px))] md:grid-cols-[repeat(auto-fit,minmax(0,400px))] place-content-start pb-5 w-full h-auto">
            {results.map((book) => {
              return <Card key={book.id} data={book} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
