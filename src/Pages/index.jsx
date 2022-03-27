import { Card, Tag } from "../Components";
import { bookState, newBookState } from "../State_Atoms";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  limit,
} from "firebase/firestore";

function Home() {
  const [books, setBooks] = useRecoilState(bookState);
  const [newBooks, setNewBooks] = useRecoilState(newBookState);
  const [Tags, setTags] = useState([]);
  const [number, setNumber] = useState(20);
  const [term, setTerm] = useState("");
  const [Loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("Loading...")

  useEffect(() => {
    const booksRef = collection(db, "books");
    if (!term) {
     //setLoading(true)
      async function getAllBooks() {
        let q = query(booksRef, orderBy("title"), limit(number));

        const querySnapshot = await getDocs(q);
        let books = [];
        querySnapshot.forEach((doc) => {
          books.push({ id: doc.id, ...doc.data() });
        });

        let tags = ["all"];
        let ids =["l29elx"]
        books.forEach((book) => {
          //tags = [...tags, ...book.tags];
          book.tags.forEach((tag) => {
            if (!tags.includes(tag)) {
              tags.push(tag);
              ids.push(book.id)
            }
          });
        });
        let refinedTags = [];
        tags.forEach((tag, index) =>{
           refinedTags.push({id: ids[index], tag})
        })

        setTags(refinedTags);
        setBooks(() => books);
        setLoading(false);
      }
      getAllBooks();
    }

    async function getNewBooks() {
      let q = query(booksRef, limit(5), where("new", "==", true));

      const querySnapshot = await getDocs(q);
      let newBooks = [];
      querySnapshot.forEach((doc) => {
        newBooks.push({ id: doc.id, ...doc.data() });
      });

      setNewBooks(() => newBooks);
if(books.length === 0 && newBooks.length == 0){
setMsg("No books available yet or try reloading")
}
    }

    getNewBooks();


  }, [setBooks, setNewBooks, number, term, books, newBooks]);



  useEffect(() => {
    if (term) {
      async function getAllTaggedBooks() {
        const booksRef = collection(db, "books");
        if (term.toLowerCase() !== "all") {
          let q1 = query(
            booksRef,
            orderBy("title"),
            where("tags", "array-contains", term.toLowerCase()),
            limit(number)
          );

          const querySnapshot1 = await getDocs(q1);
          let books = [];
          querySnapshot1.forEach((doc) => {
            books.push({ id: doc.id, ...doc.data() });
          });

          setBooks(books);
          setLoading(false);
        } else {
          let q2 = query(booksRef, orderBy("title"), limit(number));

          const querySnapshot2 = await getDocs(q2);
          let books = [];
          querySnapshot2.forEach((doc) => {
            books.push({ id: doc.id, ...doc.data() });
          });

          setBooks(books);
          setLoading(false);
        }
      }

      getAllTaggedBooks();
    }
  }, [term, setBooks, number]);

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
    setTerm(target.innerText);
  };

  return (
    <div className="w-full min-h-[100vh] bg-white text-white">
      <div className="relative w-full h-64 before:bg-black/60 before:h-full before:w-full before:absolute before:top-0 before:left-0 before:z-10">
        <img
          src="./pasted image 0.png"
          alt="hero_img"
          className="relative h-full w-full object-center object-cover"
        />
        <blockquote className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-20 text-white w-[90%] m-auto block md:text-center">
          <q className="text-4xl block mb-7">
            Books are a gift you can open again and again
          </q>
          <cite className="opacity-90">Jeffery Thomas</cite>
        </blockquote>
      </div>
      {newBooks.length > 0 && (
        <div className="w-full h-auto p-5 md:px-10 text-accent">
          <h1 className="font-medium text-xl">Newest</h1>
          <div className="w-full grid grid-cols-[repeat(5,450px)] overflow-auto flex-nowrap h-auto overflow-nest">
            {newBooks.map((book) => {
              return <Card data={book} key={book.id} />;
            })}
          </div>
        </div>
      )}
      {books.length > 0 ? (
        <div className="w-full p-5 h-auto">
          <ul className="w-full flex justify-start items-center overflow-auto flex-nowrap h-auto overflow-nest mt-5">
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
          <div className="text-accent grid grid-cols-[repeat(auto-fit,minmax(0,500px))] md:grid-cols-[repeat(auto-fit,minmax(0,420px))] place-content-center gap-x-3 gap-y-10 py-5 w-full h-auto">
            {books.map((book) => {
              return <Card key={book.id} data={book} />;
            })}
          </div>
          {books.length >= 20 &&
            (!Loading ? (
              <button
                className="block m-auto border-current rounded-3xl border-2 text-accent px-10 py-3 hover:bg-green-100 mt-14"
                onClick={loadMore}
              >
                Load more
              </button>
            ) : (
              <p className="block m-auto text-accent transition-opacity animate-pulse mt-14">
                Loading...
              </p>
            ))}
        </div>
      ) : (
        <p className="block my-3 mx-auto text-accent text-center text-sm">
          {msg}
        </p>
      )}
    </div>
  );
}

export default Home;
