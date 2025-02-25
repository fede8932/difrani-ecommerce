import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import React from "react";
import Img from "../../atoms/img/Img";
import logo from "../../../assets/logo/logo_sin_fondo.png";

interface Props {
  button: React.ReactNode;
  children: React.ReactNode;
  title: string;
  size?: string;
  closeFn?: () => void;
}

function ModalComponent(props: Props) {
  const { children, button, title, size, closeFn } = props;
  const [opened, { open, close }] = useDisclosure(false);

  const onClose = () => {
    closeFn ? closeFn() : null;
    close();
  };

  // Define a new button element with the onClick handler attached
  const triggerButton = React.isValidElement(button) ? (
    React.cloneElement(button as React.ReactElement, { onClick: open })
  ) : (
    <button onClick={open}>Abrir modal</button>
  );

  return (
    <>
      <Modal.Root
        centered
        opened={opened}
        onClose={onClose}
        size={size}
        transitionProps={{
          transition: "fade-down",
          duration: 280,
          timingFunction: "linear",
        }}
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Img src={logo} alt="Logo" width="65px" margin="5px 10px 0px 0px" />
            <Modal.Title>{title}</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            {React.isValidElement(children)
              ? React.cloneElement(
                  children as React.ReactElement<{ onClose: () => void }>,
                  { onClose }
                )
              : children}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      {triggerButton}
    </>
  );
}

export default ModalComponent;
