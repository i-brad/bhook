function Tag({ tag, className = "", handle }) {
  return (
    <li
      className={`tag inline-block py-2 px-4 hover:bg-green-100 cursor-pointer rounded-3xl text-sm border-current mr-2 text-accent border-2 first-letter:capitalize whitespace-nowrap ${className}`}
    >
      <button
        className="first-letter:capitalize whitespace-nowrap h-full w-full"
        onClick={handle}
      >
        {tag}
      </button>
    </li>
  );
}

export default Tag;
