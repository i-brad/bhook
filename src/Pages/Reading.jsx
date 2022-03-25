import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function Reading() {
  //PDFjs worker from an external cdn
  const [url, setURL] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1); //setting 1 to show first page

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  const params = useParams();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset) =>
    setPageNumber((prevPageNumber) => prevPageNumber + offset);

  const previousPage = () => changePage(-1);

  const nextPage = () => changePage(1);

  useEffect(() => {
    async function getBook() {
      let id = params.book.split("-")[1];
      const docRef = doc(db, "books", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //console.log("Document data:", docSnap.data());
        setURL(docSnap.data()?.fileURL);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    getBook();
  }, [params.book]);

  return (
    <div className="p-5 md:px-10 text-accent w-full relative">
      <div className="w-full max-w-full min-h-screen">
        <div className="w-full overflow-auto overflow-nest mb-10">
          <Document
            file={{
              url,
              withCredentials: true,
            }}
            onLoadSuccess={onDocumentLoadSuccess}
            externalLinkTarget="_blank"
          >
            <Page
              pageNumber={pageNumber}
              className="m-auto block w-fit max-w-full"
            />
          </Document>
        </div>
        <div className="fixed bottom-0 left-0 bg-white w-full min-h-7 flex justify-between items-center px-5 md:px-10 py-2 shadow-inner">
          <div>
            <h4 className="capitalize font-medium">
              {params.book.split("-")[0]}
            </h4>
            <p>
              Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
            </p>
          </div>
          <div>
            <button
              type="button"
              disabled={pageNumber <= 1}
              onClick={previousPage}
              className={`border-current border-2 py-2 px-4 rounded-3xl hover:bg-green-100 mr-3 ${
                pageNumber <= 1 && "opacity-50"
              }`}
            >
              Previous
            </button>
            <button
              type="button"
              disabled={pageNumber >= numPages}
              onClick={nextPage}
              className={`border-current border-2 py-2 px-4 rounded-3xl hover:bg-green-100 ${
                pageNumber >= numPages && "opacity-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reading;
