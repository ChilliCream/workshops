import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

import NetLogo from '@site/static/img/net_core_logo.svg';
import HCLogo from '@site/static/img/hotchocolate_logo.svg';
import MauiLogo from '@site/static/img/maui.svg';
import SSLogo from '@site/static/img/strawberryshake-logo.svg';

const FeatureList = [
  {
    title: 'Build the Future',
    Image: () => (
      <div className={styles.featureImage}>
        <NetLogo role="img" />
        <HCLogo role="img" />
      </div>
    ),
    description: (
      <>
        Hot Chocolate is a GraphQL server for the Microsoft .NET platform. It is
        very easy to set up and takes the clutter away.
      </>
    ),
  },
  {
    title: 'Powered by Maui',
    Image: () => (
      <div className={styles.featureImage}>
        <MauiLogo role="img" />
      </div>
    ),
    description: (
      <>
        Microsoft's Maui and Strawberry Shake allow for building rich
        data-driven mobile applications that run everywhere.
      </>
    ),
  },
];

function Feature({Image, title, description}) {
  return (
    <div className={clsx('col col--6')}>
      <div className="text--center">
        <Image />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className={clsx('col col--offset-1 col--10')}>
            <div className="container">
              <div className="row">
                {FeatureList.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
