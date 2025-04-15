import styled from "styled-components";
import { hexToRgba } from "../../../aux/rgbaConverter";

interface Props {
  src: string;
  alt: string;
  onClick?: () => void;
  st?: boolean;
  width?: string;
  height?: string;
  margin?: string;
  objectFit?: string;
}

const StockSpan = styled.span`
  background-color: ${({ theme }) => hexToRgba(theme.colors.primary, 0.7)};
  color: ${({ theme }) => hexToRgba(theme.colors.minim, 1)};
  font-weight: 600;
  padding: 2px 3px;
  border-radius: 2px;
  margin-top: -25px;
`;

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
  const { alt, src, st, ...rest } = props;
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <ImgRender src={src} alt={alt} {...rest} />
      {st ? <StockSpan>SIN STOCK</StockSpan> : null}
    </div>
  );
}

export default Img;
