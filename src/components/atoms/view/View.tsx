import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  position?: string;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  flexDirection?: "column-reverse" | "row" | "row-reverse";
  align?:
    | "center"
    | "start-center"
    | "start-start"
    | "start-end"
    | "end-center"
    | "end-start"
    | "end-end";
}

const ViewContainer = styled.div<{
  position?: string;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  flexDirection?: string;
}>`
  position: ${(props) => (props.position ? props.position : "static")};
  padding: ${(props) => (props.padding ? props.padding : "0px")};
  margin: ${(props) => (props.margin ? props.margin : "0px")};
  width: ${(props) => (props.width ? props.width : "")};
  height: ${(props) => (props.height ? props.height : "")};
  display: flex;
  flex-direction: ${(props) =>
    props.flexDirection ? props.flexDirection : "column"};
`;

function View(props: Props): React.ReactNode {
  const { children, ...rest } = props;
  return <ViewContainer {...rest}>{children}</ViewContainer>;
}

export default View;
