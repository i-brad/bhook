import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Card, Loader, Tag } from "../Components";
import { db } from "../firebase";
import { bookState } from "../State_Atoms";

function Home() {
  const [books, setBooks] = useRecoilState(bookState);
  const [Tags, setTags] = useState([]);
  const [number, setNumber] = useState(20);
  const [Loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    const booksRef = collection(db, "books");

    setLoading(true);
    async function getAllBooks() {
      let q = query(booksRef, orderBy("title"), limit(number));

      const querySnapshot = await getDocs(q);
      let books = [];
      querySnapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() });
      });

      let tags = ["all"];
      let ids = ["l29elx"];
      books.forEach((book) => {
        book.tags.forEach((tag) => {
          if (!tags.includes(tag)) {
            tags.push(tag);
            ids.push(book.id);
          }
        });
      });
      let refinedTags = [];
      tags.forEach((tag, index) => {
        refinedTags.push({ id: ids[index], tag });
      });

      setTags(refinedTags);
      setBooks(books);
      setLoading(false);
    }
    getAllBooks();
  }, [setBooks, number]);

  async function getAllTaggedBooks(term) {
    const booksRef = collection(db, "books");
    let books = [];
    if (term.toLowerCase() !== "all") {
      let q1 = query(
        booksRef,
        where("tags", "array-contains", term.toLowerCase()),
        limit(number)
      );
      const querySnapshot1 = await getDocs(q1);

      querySnapshot1.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() });
      });
    } else {
      let q2 = query(booksRef, orderBy("title"), limit(number));

      const querySnapshot2 = await getDocs(q2);
      querySnapshot2.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() });
      });
    }
    setBooks(books);
    setLoading(false);
  }

  const loadMore = () => {
    setNumber(number + 10);
    setLoading(true);
  };

  const handle = (e) => {
    let target = e.target;

    document.querySelectorAll(".tag").forEach((t) => {
      t.classList.remove("bg-green-100");
    });

    target.parentElement.classList.add("bg-green-100");
    setLoading(true);
    getAllTaggedBooks(target.id);
  };

  return (
    <div className="w-full min-h-[100vh] bg-white text-white">
      <div className="relative w-full h-64 before:bg-black/60 before:h-full before:w-full before:absolute before:top-0 before:left-0 before:z-10">
        <img
          src="./pasted image 0.png"
          alt="hero_img"
          className="relative object-cover object-center w-full h-full"
        />
        <blockquote className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-20 text-white w-[90%] m-auto block md:text-center">
          <q className="block text-4xl mb-7">
            Books are a gift you can open again and again
          </q>
          <cite className="opacity-90">Jeffery Thomas</cite>
        </blockquote>
      </div>
      {books.length > 0 ? (
        <div className="w-full h-auto p-5">
          <ul className="flex items-center justify-start w-full h-auto mt-5 overflow-auto flex-nowrap overflow-nest">
            {Tags.map((tag, index) => {
              if (index === 0) {
                return (
                  <Tag
                    key={tag.id + index}
                    tag={tag.tag}
                    className="bg-green-100"
                    handle={handle}
                  />
                );
              }
              return <Tag key={tag.id + index} tag={tag.tag} handle={handle} />;
            })}
          </ul>
          {Loading && (
            <div className="w-6 h-6 mx-auto my-5 transition-all border-2 border-[#086972] rounded-full animate-spin border-l-transparent"></div>
          )}
          <div className="grid w-full h-auto grid-cols-1 py-5 text-accent md:grid-cols-2 xl:md:grid-cols-3 gap-x-3 gap-y-10">
            {books.map((book) => {
              return <Card key={book.id} data={book} />;
            })}
          </div>
          {books.length >= 20 &&
            (!Loading ? (
              <button
                className="block px-10 py-3 m-auto border-2 border-current rounded-3xl text-accent hover:bg-green-100 mt-14"
                onClick={loadMore}
              >
                Load more
              </button>
            ) : (
              <p className="block m-auto transition-opacity text-accent animate-pulse mt-14">
                Loading...
              </p>
            ))}
        </div>
      ) : (
        <p className="block mx-auto my-3 text-sm text-center text-accent">
          {msg}
        </p>
      )}
    </div>
  );
}

export default Home;
