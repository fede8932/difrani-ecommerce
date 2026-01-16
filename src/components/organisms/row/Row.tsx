import styled from "styled-components";
import View from "../../atoms/view/View";
import Img from "../../atoms/img/Img";
import img from "../../../assets/amortiguador-de-coche.jpg"; // aca va la imagen sin imagen
import { IProduct } from "../../../redux/reducers/catalogoReducer";
import Skeleton from "@mui/material/Skeleton";
import { AddCartItemsState } from "../../../redux/reducers/cartListReducer";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { calcularSellPrice } from "../../../aux/prices";
import { breakpoints } from "../../../resolutions";
import { Button, Label } from "semantic-ui-react";
import { Tooltip } from "antd";
import TooltipContent from "../../molecules/TooltipContent/TooltipContent";
import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

interface Props {
  product: IProduct;
  loading: boolean;
}

const RowContainer = styled(View)`
  padding: 8px 5px;
  margin: 10px 6px;
  border-radius: 2px;
  justify-content: flex-start;
  flex-direction: row;
  background: rgb(247, 255, 250);
  background: radial-gradient(
    circle,
    rgba(247, 255, 250, 1) 0%,
    rgba(249, 249, 249, 1) 100%
  );
  box-shadow: 0px 0px 10px -2px rgba(225, 79, 79, 0.33);
  -webkit-box-shadow: 0px 0px 10px -2px rgba(225, 79, 79, 0.33);
  -moz-box-shadow: 0px 0px 10px -2px rgba(225, 79, 79, 0.33);
`;

// const PriceContainer = styled(View)<{ stock: number }>`
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   background-color: ${({ theme }) => hexToRgba(theme.colors.black, 0.1)};
//   border-radius: 2px;
//   padding: 5px 10px;
//   color: ${({ theme }) => theme.colors.text};
//   justify-content: space-between;
//   align-items: center;
//   justify-content: space-around;
//   flex-direction: row;
// `;

const ActionContainer = styled(View)`
  width: calc(25%);
  padding: 20px;
  justify-content: space-between;

  span {
    font-size: 16px;
  }
`;

const DescripCont = styled(View)`
  width: calc(55%);
  margin-top: -5px;
  color: ${({ theme }) => theme.colors.wideText};
  height: 155px;
  padding: 15px;
  margin-top: 10px;
  // align-items: center;
`;

const StyledSpan = styled.span<{
  size?: string;
  color?: string;
  weight?: number;
}>`
  cursor: pointer;
  color: ${({ theme, color }) =>
    color ? theme.colors[color] : theme.colors.text};
  font-weight: ${({ weight }) => (weight ? weight : 500)};
  font-size: ${({ size }) => (size ? size : 15)};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const StyledDescription = styled.p`
  margin: 0;
  margin-top: 10px;
  font-size: 16px;
  // text-align: center;
  cursor: pointer;
  width: calc(100% - 20px); /* Ancho fijo del párrafo */
  height: 65px; /* Altura fija del párrafo */
  overflow: hidden; /* Oculta cualquier texto que desborde */
  word-wrap: break-word; /* Rompe palabras largas */
  overflow-wrap: break-word; /* Rompe palabras largas */
  text-overflow: ellipsis;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  @media (max-width: ${breakpoints.mobileLarge}px) {
    font-size: 9px;
  }
`;

const MyImg = styled(Img)`
  cursor: pointer;
  @media (max-width: ${breakpoints.mobileLarge}px) {
    display: none;
  }
`;

const PriceSpan = styled.span<{
  color?: string;
}>`
  color: ${({ theme, color }) => (color ? color : theme.colors.text)};
  font-weight: 700;
`;

function Row(props: Props): React.ReactNode {
  const { product, loading } = props;

  const userState = useSelector((state: RootState) => state.user);
  // const cartState = useSelector((state: RootState) => state.cartList);

  const dispatch: AppDispatch = useDispatch();
  const discountsState = useSelector((state: RootState) => state.discounts);
  const rentabState = useSelector((state: RootState) => state.rentabilidad);

  const navigate = useNavigate();

  const confirmAddCartItem = () => {
    addCartItem();
  };

  const addCartItem = () => {
    dispatch(
      AddCartItemsState({
        productId: product.id,
        brandId: product.brand.id,
        cartId: userState.data?.cartId || 0,
        amount: 1,
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

  const goToDetail = () => {
    navigate(`/product/${product.article}`);
  };
  return (
    <RowContainer width="85%" height="185px">
      {product.sales?.length > 0 || product.brand.sales?.length > 0 ? (
        <Tooltip
          placement="rightBottom"
          title={<TooltipContent product={product} />}
        >
          <div
            style={{ marginLeft: "10px", position: "absolute", width: "48px" }}
          >
            <Label color="red" ribbon>
              Oferta
            </Label>
          </div>
        </Tooltip>
      ) : null}
      {loading ? (
        <Skeleton variant="rectangular" width="200px" height="97%" />
      ) : (
        <MyImg
          st={product.stock.stock < 1}
          src={
            product?.images.length > 0
              ? product?.images[0].url
              : product.equivalence?.images[0]
              ? product.equivalence.images[0].url
              : img
          }
          alt="foto"
          width="230px"
          height="97%"
          margin="0px 0px 0px 20px"
          objectFit="contain"
          onClick={goToDetail}
        />
      )}
      <DescripCont>
        <StyledDescription>
          {loading ? (
            <>
              <Skeleton
                variant="text"
                width="100%"
                style={{ marginTop: "15px" }}
              />
              <Skeleton variant="text" width="100%" />
            </>
          ) : (
            <span onClick={goToDetail}>{`${product?.description.toUpperCase()}`}</span>
          )}
        </StyledDescription>
        {loading ? (
          <Skeleton variant="text" width="100px" />
        ) : (
          <StyledSpan size="18px" weight={500} onClick={goToDetail}>
            Artículo: {product?.article.toUpperCase()}
          </StyledSpan>
        )}
        {loading ? (
          <Skeleton variant="text" width="100px" />
        ) : (
          <StyledSpan size="10px" weight={500}>
            Categoría: {product?.brand.name.toUpperCase()}
          </StyledSpan>
        )}
      </DescripCont>
      <ActionContainer>
        <span>
          Precio de lista:{" "}
          <PriceSpan color="#e14f4f">
            ${calcularSellPrice(product, discountsState.data)}
          </PriceSpan>
        </span>
        <span>
          Precio de venta:{" "}
          <PriceSpan color="#4CAF50">
            ${calcularSellPrice(product, discountsState.data, rentabState)}
          </PriceSpan>
        </span>
        <Button onClick={confirmAddCartItem}>Agregar</Button>
      </ActionContainer>
    </RowContainer>
  );
}

export default Row;
