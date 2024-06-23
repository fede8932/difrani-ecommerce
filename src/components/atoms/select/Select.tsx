/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import Icon from "../icon/Icon";
import { hexToRgba } from "../../../aux/rgbaConverter";

// AL METERLO EN UN FORM, AGREGAR LOGICA PARA EL SUBMIT VACIO

interface Props {
  placeholder: string;
  options: { key: string; value: string }[];
  validate: boolean;
  height?: string;
  width?: string;
  onSelect?: (value: any) => void;
}

const slideDown = keyframes`
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-10px);
    opacity: 0;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectClick: any = styled.div<{ width?: string; height?: string }>`
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 9px 2px 13px;
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.wideText};
  border: 1px solid ${({ theme }) => theme.colors.medium};
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "20px"};
`;

const BoxOptions = styled.div<{
  width?: string;
  height?: string;
  open: boolean;
}>`
  position: absolute;
  max-height: 270px;
  overflow-y: auto;
  padding: 2px;
  border-radius: 15px;
  border: 1px solid ${({ theme }) => theme.colors.medium};
  background-color: ${({ theme }) => theme.colors.background};
  width: ${({ width }) => width || "100%"};
  animation: ${({ open }) => (open ? slideDown : slideUp)} 0.4s ease forwards;

  /* Estilos para el scroll */
  &::-webkit-scrollbar {
    width: 0px;
  }
`;

const Option = styled.div<{ key: number; optionCount: number }>`
  width: 100%;
  padding: 3px 7px;
  border-top-right-radius: ${({ key }) => (key == 0 ? "15px" : "0px")};
  border-top-left-radius: ${({ key }) => (key == 0 ? "15px" : "0px")};
  border-bottom-right-radius: ${({ key, optionCount }) =>
    key == optionCount - 1 ? "15px" : "0px"};
  border-bottom-left-radius: ${({ key, optionCount }) =>
    key == optionCount - 1 ? "15px" : "0px"};

  &:hover {
    background-color: ${({ theme }) => hexToRgba(theme.colors.success, 0.1)};
  }
`;

function Select(props: Props): React.ReactNode {
  const { placeholder, options, onSelect, ...rest } = props;
  const [open, setOpen] = useState(false);
  const [optionSelected, setOptionSelected] = useState({ key: "", value: "" });

  const selectRef = useRef<HTMLDivElement>(null); // Ref para el componente Select

  // console.log(optionSelected);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Verificar si el clic ocurrió fuera del componente
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={selectRef}>
      <SelectClick
        {...rest}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <span>
          {optionSelected.key != "" ? optionSelected.key : placeholder}
        </span>
        <Icon active={false} color={"wideText"}>
          {open ? "arrow_drop_up" : "arrow_drop_down"}
        </Icon>
      </SelectClick>
      {open ? (
        <BoxOptions {...rest} open={open}>
          {options.map((option, i) => (
            <Option
              optionCount={options.length}
              key={i}
              onClick={() => {
                setOptionSelected({ key: option.key, value: option.value });
                onSelect ? onSelect(option.value) : null;
                setOpen(false);
              }}
            >
              {option.key}
            </Option>
          ))}
        </BoxOptions>
      ) : null}
    </div>
  );
}

export default Select;
