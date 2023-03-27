import { useEffect, useState } from "react";

export default function Test() {
  const [data, setData] = useState("");

  useEffect(() => {
    const getdata = async () => {
      const res = await fetch("http://localhost:3000/user/all");
      const rep = await res.text();
      setData(rep);
    };
    getdata();
  }, []);

  return <h1>{data}</h1>;
}
