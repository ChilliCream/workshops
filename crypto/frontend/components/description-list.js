import styled from '@emotion/styled';

export const DL = styled.dl(
  ({theme}) => `
  padding: ${theme.spacing(1, 2)};
  border-bottom: 1px solid ${theme.palette.line};
  margin-top: 0;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${theme.spacing(1)};
`,
);

export const DT = styled.dt(
  ({theme}) => `
  display: flex;
  gap: ${theme.spacing(1)};
  font-size: ${theme.typography.fontSizeSmall};
  font-weight: ${theme.typography.fontWeightRegular};
`,
);

export const DD = styled.dd(
  ({theme, align = 'end'}) => `
  margin: 0;
  align-self: ${align};
  font-size: ${theme.typography.fontSizeMedium};
  font-weight: ${theme.typography.fontWeightMedium};
  line-height: 1;
`,
);
