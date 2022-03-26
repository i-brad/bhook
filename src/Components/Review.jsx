function Review({ data }) {
  return (
    <blockquote className="block w-full max-w-full text-accent bg-green-100 rounded-md p-3">
      <q className="text-sm md:text-lg block mb-3">{data?.review}</q>
      <cite className="text-xs md:text-sm block text-right">
        {data?.name || "anonymous"}
      </cite>
    </blockquote>
  );
}

export default Review;
