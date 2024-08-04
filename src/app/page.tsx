import Image from "next/image";

export default function Home() {
  return (
    <main>
      <h4>Search</h4>
      <input
        type="text"
        placeholder="Search for a movie"
        className="w-full p
        y-2 border border-gray-300 rounded-lg"
      />
    </main>
  );
}
