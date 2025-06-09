import styled from "styled-components";
import { IProduct } from "../../../redux/reducers/searchInputReducer";
import ModalComponent from "../../molecules/modal/ModalComponent";
import View from "../../atoms/view/View";
import img from "../../../assets/amortiguador-de-coche.jpg";
// import Img from "../../atoms/img/Img";
import { hexToRgba } from "../../../aux/rgbaConverter";
import Button from "../../atoms/button/Button";
import AmountInput from "../../molecules/amountInput/AmountInput";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import {
  calcularPrice,
  calcularSellPrice,
  calcularSubTotal,
} from "../../../aux/prices";
import { searchRentab } from "../../../aux/searchRentab";
import { AddCartItemsState } from "../../../redux/reducers/cartListReducer";
import toast from "react-hot-toast";
import RoleProtectedComponent from "../../../protected/RoleProtectedComponent";
import PricesProtected from "../../../protected/PricesProtected";
import { breakpoints } from "../../../resolutions";
import { Magnifier } from "react-image-magnifiers";
// import Swal from "sweetalert2";

interface Props {
  children: React.ReactNode;
  product: IProduct;
}

const DetailsContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => hexToRgba(theme.colors.medium, 0.8)};

  @media (max-width: ${breakpoints.mobileLarge}px) {
    flex-direction: column;
    align-items: center;
  }
`;

const DetailsInfo = styled(View)`
  max-width: 49%;
  flex-direction: column;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    max-width: 95%;
    padding-bottom: 15px;
  }
`;

const TextTitleDetail = styled.span`
  width: 100%;
  margin-top: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.wideText};
  font-size: 16px;
  font-weight: 600;
`;
const TextDetail = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Detail = (props: any): React.ReactNode => {
  const {
    product,
    discountState,
    rentabState,
    amountProdInCart,
    handleAdd,
    handleMinus,
    value,
    handleChange,
    addCartItem,
    onClose,
  } = props;

  const confirmAddCartItem = () => {
    // if (amountProdInCart) {
    //   Swal.fire({
    //     title: "Deseas agregar mas unidades?",
    //     text: "El artículo ya se encuentra en el carrito",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonColor: "#4fe187",
    //     cancelButtonColor: "grey",
    //     confirmButtonText: "Confirmar",
    //     cancelButtonText: "Cancelar",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       addCartItem();
    //     }
    //   });
    //   return;
    // }
    addCartItem();
    onClose();
  };
  return (
    <DetailsContainer /*height="400px"*/>
      <Magnifier
        imageSrc={product?.images.length > 0 ? product?.images[0].url : img}
        imageAlt="Imagen"
        largeImageSrc={
          product?.images.length > 0 ? product?.images[0].url : img
        }
      />
      {/* <Img
          margin="10px 0px 0px 0px"
          src={product?.images.length > 0 ? product?.images[0].url : img}
          alt="imagen"
          width="85%"
          objectFit="contain"
        /> */}
      <DetailsInfo>
        <span
          style={{
            fontWeight: "700",
            marginTop: "10px",
            marginBottom: "18px",
          }}
        >
          {product?.description}
        </span>
        <TextTitleDetail>
          Precio de lista:
          <TextDetail>
            $
            <PricesProtected>
              {calcularPrice(product, discountState.data, "price")}
            </PricesProtected>
          </TextDetail>
        </TextTitleDetail>
        <TextTitleDetail>
          Precio de lista con IVA:
          <TextDetail>
            $
            <PricesProtected>
              {calcularPrice(product, discountState.data, "endPrice")}
            </PricesProtected>
          </TextDetail>
        </TextTitleDetail>
        <RoleProtectedComponent accessList={[4]}>
          <TextTitleDetail>
            Rentabilidad de la marca:
            <TextDetail>
              {(
                searchRentab(
                  rentabState?.byBrand,
                  rentabState?.general,
                  product?.brand.id
                ).surchargePercentage * 100
              ).toFixed(2)}
              %
            </TextDetail>
          </TextTitleDetail>
        </RoleProtectedComponent>
        <RoleProtectedComponent accessList={[4]}>
          <TextTitleDetail>
            Precio de venta sin IVA:
            <TextDetail>
              ${calcularSellPrice(product, discountState.data, rentabState)}
            </TextDetail>
          </TextTitleDetail>
        </RoleProtectedComponent>
        <RoleProtectedComponent accessList={[4]}>
          <TextTitleDetail>
            <span>
              Cantidad{" "}
              <span style={{ color: "grey", fontSize: "10px" }}>
                {amountProdInCart
                  ? `(${amountProdInCart.amount} en carrito)`
                  : ""}
              </span>
              :
            </span>
            <TextDetail>
              <AmountInput
                add={handleAdd}
                minus={handleMinus}
                width="40px"
                height="27px"
                value={value}
                onChange={handleChange}
              />
            </TextDetail>
          </TextTitleDetail>
        </RoleProtectedComponent>
        <RoleProtectedComponent accessList={[4]}>
          <TextTitleDetail style={{ marginBottom: "25px" }}>
            Subtotal:
            <TextDetail>
              $
              {calcularSubTotal(
                product,
                discountState.data,
                rentabState,
                value
              )}
            </TextDetail>
          </TextTitleDetail>
        </RoleProtectedComponent>
        <RoleProtectedComponent accessList={[4]}>
          <Button
            icon="add_shopping_cart"
            text="Agregar al carrito"
            color="primary"
            height="30px"
            onClick={confirmAddCartItem}
          />
        </RoleProtectedComponent>
      </DetailsInfo>
    </DetailsContainer>
  );
};

function ProductDetails(props: Props): React.ReactNode {
  const { children, product } = props;

  const userState = useSelector((state: RootState) => state.user);
  const cartState = useSelector((state: RootState) => state.cartList);

  const amountProdInCart = useMemo(
    () => cartState.data.find((item) => item.productId == product.id),
    [cartState.data, product.id]
  );

  // console.log(amountProdInCart)

  const dispatch: AppDispatch = useDispatch();

  const discountState = useSelector((state: RootState) => state.discounts);
  const rentabState = useSelector((state: RootState) => state.rentabilidad);

  const [value, setValue] = useState("1");

  const handleChange = (value: string) => {
    setValue(value);
  };

  const handleAdd = () => {
    let number: number = Number(value);
    if (isNaN(number)) {
      setValue("1");
    } else {
      number++;
      setValue(number.toString());
    }
  };

  const handleMinus = () => {
    let number: number = Number(value);
    if (isNaN(number)) {
      setValue("1");
    } else if (number == 1) {
      return;
    } else {
      number--;
      setValue(number.toString());
    }
  };

  const addCartItem = () => {
    if (isNaN(Number(value))) {
      toast.error("La cantidad asignada no es válida");
      return;
    }
    dispatch(
      AddCartItemsState({
        productId: product.id,
        brandId: product.brand.id,
        cartId: userState.data?.cartId || 0,
        amount: Number(value),
      })
    )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: any) => {
        if (res?.error) {
          toast.error(res.error.message);
        } else {
          toast.success("Articulo agregado con exito");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error en el servidor, no se pudo agregar el producto");
      });
  };

  return (
    <ModalComponent
      title={`${product?.brand?.name} - Artículo ${product?.article}`.toUpperCase()}
      button={children}
      size="1000px"
    >
      <Detail
        product={product}
        discountState={discountState}
        rentabState={rentabState}
        amountProdInCart={amountProdInCart}
        handleAdd={handleAdd}
        handleMinus={handleMinus}
        value={value}
        handleChange={handleChange}
        addCartItem={addCartItem}
      />
    </ModalComponent>
  );
}

export default ProductDetails;
