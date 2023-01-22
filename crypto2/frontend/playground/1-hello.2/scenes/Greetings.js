import {useEffect, useState} from 'react';

const fetchGraphQL = async (query, variables) => {
  const response = await fetch(process.env.NEXT_PUBLIC_HTTP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  return await response.json();
};

export const Greetings = () => {
  const [greetings, setGreetings] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetchGraphQL(`
      query GreetingsQuery {
        greetings
      }
    `)
      .then((response) => {
        if (mounted) {
          setGreetings(response.data.greetings);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return <h1>{greetings}</h1>;
};
