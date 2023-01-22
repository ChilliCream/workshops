import {Suspense} from 'react';
import {graphql, useLazyLoadQuery} from 'react-relay';

export const Greetings = () => {
  const data = useLazyLoadQuery(
    graphql`
      query GreetingsQuery($name: String!) {
        greetings(name: $name)
      }
    `,
    {name: 'Luke'},
  );

  return <h1>{data.greetings}</h1>;
};

export default () => (
  <Suspense fallback={false}>
    <Greetings />
  </Suspense>
);
