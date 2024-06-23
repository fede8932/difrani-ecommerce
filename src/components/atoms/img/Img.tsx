import styled from "styled-components";

interface Props {
  src: string;
  alt: string;
  onClick?: () => void;
  width?: string;
  height?: string;
  margin?: string;
  objectFit?: string;
}

const ImgRender = styled.img<{
  width?: string;
  height?: string;
  margin?: string;
  objectFit?: string;
}>`
  cursor: pointer;
  margin: ${({ margin }) => margin || "0px 15px 0px 0px"};
  width: ${({ width }) => width || ""};
  height: ${({ height }) => height || ""};
  object-fit: ${({ objectFit }) => objectFit || "fit"};
`;

function Img(props: Props): React.ReactNode {
  const { alt, src, ...rest } = props;
  return <ImgRender src={src} alt={alt} {...rest} />;
}

export default Img;
