import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
//import { Link } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { isSearchOnState, isUploadOnState } from "../State_Atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Card } from "../Components";
import { db } from "../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

function Search() {
  let [isSearchOn, setSearchOn] = useRecoilState(isSearchOnState);
  let [searchTerm, setSearchTerm] = useState("");
  let [results, setResults] = useState([]);
  let closeSearchModal = () => {
    setSearchOn(!isSearchOn);
  };

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
        className="absolute top-3 right-5 md:right-10 text-accent z-20 w-10 h-auto hover:bg-green-100 rounded p-1"
      >
        <CloseIcon />
      </button>
      <form className="sticky top-0 z-10 w-full h-auto mb-5 flex justify-start items-center bg-white border-b-slate-300 border-b-2">
        <button type="submit">
          <SearchOutlinedIcon className="text-accent" />
        </button>
        <input
          type="text"
          name="search"
          placeholder="Search...."
          className="flex-1 outline-none border-none px-3 py-4"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </form>
      <div className="text-accent">
        {/* <h4 className="font-medium opacity-80">Popular book searches</h4>
        <ul>
          <li className="py-2 pl-1 underline">
            <Link to="/">Broken pages</Link>
          </li>
          <li className="py-2 pl-1 underline">
            <Link to="/">Growth zero</Link>
          </li>
          <li className="py-2 pl-1 underline">
            <Link to="/">Fantastic life</Link>
          </li>
          <li className="py-2 pl-1 underline">
            <Link to="/">Not a begger</Link>
          </li>
          <li className="py-2 pl-1 underline">
            <Link to="/">Steal like an artist</Link>
          </li>
        </ul> */}

        <p className="mt-10 block">
          <button className="underline font-medium" onClick={openUploadModal}>
            Upload
          </button>{" "}
          a book for others to read.
        </p>
      </div>
      {results.length > 0 && (
        <div className="text-accent w-full h-auto mt-5">
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
