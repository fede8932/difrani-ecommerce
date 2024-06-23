import styled from "styled-components";
import View from "../../atoms/view/View";
import Img from "../../atoms/img/Img";
import img from "../../../assets/amortiguador-de-coche.jpg"; // aca va la imagen sin imagen
import { hexToRgba } from "../../../aux/rgbaConverter";
import IconButton from "../../atoms/iconButton/IconButton";
import { IProduct } from "../../../redux/reducers/catalogoReducer";
import Skeleton from "@mui/material/Skeleton";
import ProductDetails from "../productDetails/ProductDetails";
import { AddCartItemsState } from "../../../redux/reducers/cartListReducer";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { calcularSellPrice } from "../../../aux/prices";

interface Props {
  product: IProduct;
  loading: boolean;
}

const RowContainer = styled(View)`
  padding: 8px 5px;
  margin: 10px 6px;
  border-radius: 10px;
  justify-content: flex-start;
  flex-direction: row;
  background: rgb(247, 255, 250);
  background: radial-gradient(
    circle,
    rgba(247, 255, 250, 1) 0%,
    rgba(249, 249, 249, 1) 100%
  );
  border: 2px solid ${({ theme }) => hexToRgba(theme.colors.secundary, 0.1)};
  box-shadow: 0px 0px 10px -2px rgba(79, 225, 135, 0.33);
  -webkit-box-shadow: 0px 0px 10px -2px rgba(79, 225, 135, 0.33);
  -moz-box-shadow: 0px 0px 10px -2px rgba(79, 225, 135, 0.33);
`;

const PriceContainer = styled(View)<{ stock: number }>`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  background-color: ${({ theme, stock }) =>
    stock > 4
      ? hexToRgba(theme.colors.primary, 0.1)
      : stock > 0
      ? hexToRgba(theme.colors.warning, 0.1)
      : hexToRgba(theme.colors.alert, 0.1)};
  border-radius: 10px;
  padding: 5px 10px;
  color: ${({ theme }) => theme.colors.text};
  justify-content: space-between;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
`;

const DescripCont = styled(View)`
  width: calc(100%);
  margin-top: -20px;
  color: ${({ theme }) => theme.colors.wideText};
  height: 155px;
  padding: 15px;
  align-items: center;
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
  text-align: center;
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
`;

function Row(props: Props): React.ReactNode {
  const { product, loading } = props;

  const userState = useSelector((state: RootState) => state.user);

  const dispatch: AppDispatch = useDispatch();
  const discountsState = useSelector((state: RootState) => state.discounts);
  const rentabState = useSelector((state: RootState) => state.rentabilidad);

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
  return (
    <RowContainer width="100%" height="135px">
      {loading ? (
        <Skeleton variant="rectangular" width="200px" height="97%" />
      ) : (
        <ProductDetails product={product}>
          <Img
            src={product?.images.length > 0 ? product?.images[0] : img}
            alt="foto"
            width="200px"
            height="97%"
            margin="0px"
            objectFit="contain"
          />
        </ProductDetails>
      )}
      <DescripCont>
        {loading ? (
          <Skeleton variant="text" width="100px" />
        ) : (
          <ProductDetails product={product}>
            <StyledSpan size="18px" weight={500}>
              {product?.article.toUpperCase()}
            </StyledSpan>
          </ProductDetails>
        )}
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
            <ProductDetails product={product}>
              <span>{product?.description.toUpperCase()}</span>
            </ProductDetails>
          )}
        </StyledDescription>
        <PriceContainer
          height="39-2px"
          width="250px"
          stock={product.stock.stock}
        >
          {loading ? (
            <Skeleton variant="text" width="70px" />
          ) : (
            <ProductDetails product={product}>
              <StyledSpan size="15px" color="secundary" weight={700}>
                ${calcularSellPrice(product, discountsState.data, rentabState)}
              </StyledSpan>
            </ProductDetails>
          )}
          <IconButton icon="shopping_cart" size="20px" onClick={addCartItem} />
        </PriceContainer>
      </DescripCont>
    </RowContainer>
  );
}

export default Row;
