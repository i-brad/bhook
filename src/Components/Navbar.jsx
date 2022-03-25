import { Link } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useSetRecoilState } from "recoil";
import { isSearchOnState, isUploadOnState } from "../State_Atoms";

function Navbar() {
  let setSearchOn = useSetRecoilState(isSearchOnState);

  let openSearchModal = () => {
    setSearchOn(true);
  };

  let setUploadOn = useSetRecoilState(isUploadOnState);

  let openUploadModal = () => {
    setUploadOn(true);
  };

  return (
    <nav className="w-full h-auto px-5 md:px-10 py-3 bg-white shadow-md flex items-center justify-between sticky top-0 z-50">
      <Link to="/">
        <svg viewBox="0 0 330 93.60000000000001" className="w-28 h-auto">
          <g
            featurekey="symbolFeature-0"
            transform="matrix(1.2799823720376449,0,0,1.2799823720376449,-34.32528898965985,-17.199123484627492)"
            fill="#086972"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              fill="#086972"
              d="M62.443,70.625c0-6.323,2.678-11.23,5.51-16.426c2.824-5.173,5.74-10.521,5.74-17.324  c0-12.924-10.514-23.438-23.438-23.438c-12.923,0-23.438,10.514-23.438,23.438c0,6.802,2.917,12.151,5.741,17.324  c2.832,5.196,5.509,10.104,5.509,16.426c0,0.518,0.42,0.938,0.938,0.938h22.5C62.024,71.562,62.443,71.143,62.443,70.625z   M34.203,53.301c-2.832-5.196-5.51-10.104-5.51-16.426c0-11.889,9.674-21.562,21.562-21.562c11.89,0,21.562,9.673,21.562,21.562  c0,6.323-2.677,11.23-5.509,16.426c-2.141,3.922-4.312,7.956-5.25,12.636H39.453C38.516,61.257,36.344,57.224,34.203,53.301z   M39.926,69.688c-0.025-0.641-0.094-1.26-0.169-1.875h20.999c-0.075,0.615-0.143,1.234-0.169,1.875H39.926z"
            ></path>
            <path
              xmlns="http://www.w3.org/2000/svg"
              fill="#086972"
              d="M59.631,73.438h-18.75c-0.518,0-0.938,0.419-0.938,0.938s0.42,0.938,0.938,0.938h18.75  c0.519,0,0.938-0.419,0.938-0.938S60.149,73.438,59.631,73.438z"
            ></path>
            <path
              xmlns="http://www.w3.org/2000/svg"
              fill="#086972"
              d="M60.568,78.125c0-0.518-0.419-0.938-0.938-0.938h-18.75c-0.518,0-0.938,0.419-0.938,0.938  s0.42,0.938,0.938,0.938h18.75C60.149,79.062,60.568,78.643,60.568,78.125z"
            ></path>
            <path
              xmlns="http://www.w3.org/2000/svg"
              fill="#086972"
              d="M42.756,80.879c-0.518,0-0.938,0.419-0.938,0.938c0,4.746,6.173,4.746,8.496,4.746  c2.324,0,8.496,0,8.496-4.746c0-0.518-0.419-0.938-0.938-0.938H42.756z M50.314,84.688c-4.533,0-6.02-0.877-6.456-1.934h12.913  C56.336,83.811,54.849,84.688,50.314,84.688z"
            ></path>
            <ellipse
              xmlns="http://www.w3.org/2000/svg"
              fill="#086972"
              cx="40.881"
              cy="35.938"
              rx="1.875"
              ry="2.812"
            ></ellipse>
            <ellipse
              xmlns="http://www.w3.org/2000/svg"
              fill="#086972"
              cx="59.631"
              cy="35.938"
              rx="1.875"
              ry="2.812"
            ></ellipse>
            <circle
              xmlns="http://www.w3.org/2000/svg"
              fill="#086972"
              cx="50.256"
              cy="44.375"
              r="3.75"
            ></circle>
          </g>
          <g
            featurekey="nameFeature-0"
            transform="matrix(1.0713054331414587,0,0,1.0713054331414587,73.13726935367471,25.577523928316957)"
            fill="#086972"
          >
            <path d="M34.609 25 c-0.36461 -0.98961 -0.88531 -1.8488 -1.5624 -2.578 c-0.46875 -0.52086 -1.224 -1.1198 -2.2656 -1.797 c-1.1459 -0.57289 -2.1615 -1.0156 -3.0469 -1.3281 c0.625 -0.36461 1.3021 -0.78125 2.0313 -1.25 c0.72914 -0.625 1.276 -1.224 1.6406 -1.7969 c0.46875 -0.625 0.85938 -1.3802 1.1719 -2.2656 c0.3125 -0.9375 0.46875 -1.9531 0.46875 -3.0469 c0 -2.9166 -1.0938 -5.2344 -3.2813 -6.9531 s-5.1563 -2.5781 -8.9063 -2.5781 l-14.453 0 l0 5.7813 l13.672 0 c1.9791 0 3.5938 0.41664 4.8438 1.25 c1.0938 0.83336 1.6406 2.0313 1.6406 3.5938 c0 1.7709 -0.625 3.0469 -1.875 3.8281 c-1.3021 0.83336 -2.9948 1.25 -5.0782 1.25 l-13.203 0 l0 5.4688 l14.609 0 c2.5 0 4.401 0.44273 5.7031 1.3281 c1.25 0.9375 1.875 2.1875 1.875 3.75 c0 1.6666 -0.625 2.9427 -1.875 3.828 c-1.3021 0.88539 -3.0469 1.3281 -5.2344 1.3281 l-15.078 0 l0 5.7813 l15 0 c2.0313 0 3.9063 -0.23438 5.625 -0.70313 c1.7709 -0.52086 3.2031 -1.1719 4.2969 -1.9531 s2.0313 -1.849 2.8125 -3.2031 c0.625 -1.25 0.9375 -2.7084 0.9375 -4.375 c0 -1.3021 -0.15625 -2.4219 -0.46875 -3.3594 z M52.094 16.875 l0 -15.547 l-6.5625 0 l0 37.344 l6.5625 0 l0 -21.797 z M69.98400000000001 1.328000000000003 l0 15.547 l-11.406 0 l0 6.0938 l11.406 0 l0 15.703 l6.4844 0 l0 -37.344 l-6.4844 0 z M99.344 32.6562 c-0.78125 -0.15625 -1.5105 -0.3907 -2.1876 -0.7032 c-1.4584 -0.67711 -2.7344 -1.6146 -3.8281 -2.8125 c-1.0416 -1.0938 -1.875 -2.4479 -2.5 -4.0625 c-0.57289 -1.6146 -0.85938 -3.2552 -0.85938 -4.9219 l0 -0.15625 l0 -0.23438 c0 -1.7188 0.28648 -3.3854 0.85938 -5 c0.67711 -1.6666 1.5105 -2.9948 2.5001 -3.9844 c1.0416 -1.1979 2.2916 -2.1094 3.75 -2.7344 c0.88539 -0.41664 1.6406 -0.67703 2.2656 -0.78117 l0 -5.8594 c-1.8229 0.26039 -3.4375 0.70313 -4.8438 1.3281 c-2.2916 0.98961 -4.2448 2.3177 -5.8594 3.9844 s-2.8906 3.6458 -3.8281 5.9374 s-1.4063 4.6875 -1.4063 7.1875 l0 0.15625 l0 0.23438 c0 2.5521 0.46875 4.948 1.4063 7.1876 c0.83336 2.2396 2.0834 4.1927 3.75 5.8594 c1.6666 1.7188 3.6198 3.0469 5.8594 3.9844 c1.4063 0.625 3.0469 1.0677 4.9219 1.3281 l0 -5.9375 z M120.594 20 l0.000076294 -0.23438 c0 -2.5521 -0.46875 -4.948 -1.4063 -7.1876 c-0.9375 -2.2916 -2.2135 -4.2708 -3.8281 -5.9374 c-1.5625 -1.6666 -3.4896 -2.9688 -5.7813 -3.9063 c-1.3021 -0.625 -2.8906 -1.0677 -4.7656 -1.3281 l0 5.9375 l0.9375 0.3125 c0.46875 0.15625 0.83336 0.28648 1.0938 0.39063 c1.4584 0.67711 2.7344 1.6146 3.8281 2.8125 c1.0416 1.0938 1.875 2.4479 2.5 4.0625 c0.57289 1.6146 0.85938 3.2552 0.85938 4.9219 l0 0.15625 l0 0.23438 c0 1.7188 -0.28648 3.3854 -0.85938 5 c-0.67711 1.6666 -1.5105 2.9948 -2.5001 3.9844 c-1.0416 1.1979 -2.2916 2.1094 -3.75 2.7344 c-0.67711 0.3125 -1.3802 0.54688 -2.1094 0.70313 l0 5.9375 c1.5625 -0.20836 3.125 -0.65109 4.6875 -1.3282 c2.1354 -0.88539 4.0885 -2.2135 5.8594 -3.9844 c1.7188 -1.8229 2.9948 -3.802 3.8281 -5.9374 c0.9375 -2.2916 1.4063 -4.6875 1.4063 -7.1875 l0 -0.15625 z M140.344 32.6562 c-0.78125 -0.15625 -1.5105 -0.3907 -2.1876 -0.7032 c-1.4584 -0.67711 -2.7344 -1.6146 -3.8281 -2.8125 c-1.0416 -1.0938 -1.875 -2.4479 -2.5 -4.0625 c-0.57289 -1.6146 -0.85938 -3.2552 -0.85938 -4.9219 l0 -0.15625 l0 -0.23438 c0 -1.7188 0.28648 -3.3854 0.85938 -5 c0.67711 -1.6666 1.5105 -2.9948 2.5001 -3.9844 c1.0416 -1.1979 2.2916 -2.1094 3.75 -2.7344 c0.88539 -0.41664 1.6406 -0.67703 2.2656 -0.78117 l0 -5.8594 c-1.8229 0.26039 -3.4375 0.70313 -4.8438 1.3281 c-2.2916 0.98961 -4.2448 2.3177 -5.8594 3.9844 s-2.8906 3.6458 -3.8281 5.9374 s-1.4063 4.6875 -1.4063 7.1875 l0 0.15625 l0 0.23438 c0 2.5521 0.46875 4.948 1.4063 7.1876 c0.83336 2.2396 2.0834 4.1927 3.75 5.8594 c1.6666 1.7188 3.6198 3.0469 5.8594 3.9844 c1.4063 0.625 3.0469 1.0677 4.9219 1.3281 l0 -5.9375 z M161.594 20 l0.000076294 -0.23438 c0 -2.5521 -0.46875 -4.948 -1.4063 -7.1876 c-0.9375 -2.2916 -2.2135 -4.2708 -3.8281 -5.9374 c-1.5625 -1.6666 -3.4896 -2.9688 -5.7813 -3.9063 c-1.3021 -0.625 -2.8906 -1.0677 -4.7656 -1.3281 l0 5.9375 l0.9375 0.3125 c0.46875 0.15625 0.83336 0.28648 1.0938 0.39063 c1.4584 0.67711 2.7344 1.6146 3.8281 2.8125 c1.0416 1.0938 1.875 2.4479 2.5 4.0625 c0.57289 1.6146 0.85938 3.2552 0.85938 4.9219 l0 0.15625 l0 0.23438 c0 1.7188 -0.28648 3.3854 -0.85938 5 c-0.67711 1.6666 -1.5105 2.9948 -2.5001 3.9844 c-1.0416 1.1979 -2.2916 2.1094 -3.75 2.7344 c-0.67711 0.3125 -1.3802 0.54688 -2.1094 0.70313 l0 5.9375 c1.5625 -0.20836 3.125 -0.65109 4.6875 -1.3282 c2.1354 -0.88539 4.0885 -2.2135 5.8594 -3.9844 c1.7188 -1.8229 2.9948 -3.802 3.8281 -5.9374 c0.9375 -2.2916 1.4063 -4.6875 1.4063 -7.1875 l0 -0.15625 z M200.641 38.5156 l-12.734 -16.25 l-4.4531 4.8438 l9.2969 11.406 l7.8906 0 z M191.969 1.4059999999999988 l-17.734 18.359 l0 -18.359 l-6.4063 0 l0 37.109 l6.4063 0 l0 -8.75 l26.328 -28.359 l-8.5938 0 z M229.922 1.4059999999999988 c-2.8646 0 -5.5209 0.4686 -7.9688 1.4061 c-2.3959 0.9375 -4.4792 2.2396 -6.2501 3.9063 c-1.7188 1.5625 -3.0729 3.5416 -4.0625 5.9375 c-0.83336 2.0313 -1.3021 4.2448 -1.4063 6.6406 l0 2.3438 l6.875 0 l0 -2.3438 c0.10414 -1.7709 0.39063 -3.2031 0.85938 -4.2969 c0.625 -1.5104 1.4844 -2.8645 2.5781 -4.0624 c1.3021 -1.1979 2.6563 -2.0833 4.0625 -2.6562 c1.6146 -0.625 3.3855 -0.9375 5.3126 -0.9375 l9.8438 0 l0 -5.9375 l-9.8438 0 z M232.891 18.984 l0.000076294 1.4843 l0.078125 0 c-0.10414 1.6666 -0.41664 3.2031 -0.9375 4.6094 c-0.67711 1.6146 -1.5365 2.9427 -2.5781 3.9844 c-1.1459 1.1459 -2.5 2.0313 -4.0625 2.6563 c-1.6146 0.625 -3.3855 0.9375 -5.3126 0.9375 l-9.8438 0 l0 5.9375 l9.8438 0 c2.8646 0 5.5209 -0.46875 7.9688 -1.4063 c2.3959 -0.9375 4.4792 -2.2396 6.2501 -3.9063 c1.8229 -1.8229 3.177 -3.802 4.0624 -5.9374 c0.9375 -2.0834 1.4063 -4.375 1.4063 -6.875 l0 -1.4844 l-6.875 0 z"></path>
          </g>
        </svg>
      </Link>
      <span className="inline-flex justify-between items-center">
        <button
          className="text-accent w-10 h-auto hover:bg-green-100 rounded p-1 mr-1"
          onClick={openSearchModal}
        >
          <SearchOutlinedIcon />
        </button>
        <button
          onClick={openUploadModal}
          className="bg-accent rounded-3xl text-white text-xs font-medium px-4 py-2 inline-flex justify-between items-center"
        >
          <CloudUploadOutlinedIcon className="mr-1" />
          Upload
        </button>
      </span>
    </nav>
  );
}

export default Navbar;
