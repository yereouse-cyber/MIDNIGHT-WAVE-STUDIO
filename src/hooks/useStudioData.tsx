import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useStudioData<T>(collectionName: string, isDocument: boolean = false) {
  const [data, setData] = useState<T | T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isDocument) {
      const unsub = onSnapshot(
        doc(db, collectionName.split('/')[0], collectionName.split('/')[1]),
        (snapshot) => {
          setData(snapshot.data() as T);
          setLoading(false);
        },
        (err) => {
          console.error(`Error fetching document ${collectionName}:`, err);
          setError(err);
          setLoading(false);
        }
      );
      return unsub;
    } else {
      const q = query(collection(db, collectionName));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
          setData(items);
          setLoading(false);
        },
        (err) => {
          console.error(`Error fetching collection ${collectionName}:`, err);
          setError(err);
          setLoading(false);
        }
      );
      return unsub;
    }
  }, [collectionName, isDocument]);

  return { data, loading, error };
}
