import {memo} from 'react';
import {useState} from 'react';

import SettingsCredentials from './SettingsCredentials';
import SettingsLinks from './SettingsLinks';

export default memo(function SettingsContainer() {
  const [active, setActive] = useState('credentials');

  return (
    <>
      <SettingsLinks active={active} onChange={setActive} />
      <SettingsCredentials active={active} onChange={setActive} />
    </>
  );
});
