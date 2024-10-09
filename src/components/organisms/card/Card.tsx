import styled from "styled-components";
import View from "../../atoms/view/View";
import Img from "../../atoms/img/Img";
import img from "../../../assets/amortiguador-de-coche.jpg";
import { hexToRgba } from "../../../aux/rgbaConverter";
import IconButton from "../../atoms/iconButton/IconButton";
import {
  IProduct,
  SearchEquivalencesState,
} from "../../../redux/reducers/catalogoReducer";
import Skeleton from "@mui/material/Skeleton";
import ProductDetails from "../productDetails/ProductDetails";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { AddCartItemsState } from "../../../redux/reducers/cartListReducer";
import { calcularSellPrice } from "../../../aux/prices";
import RoleProtectedComponent from "../../../protected/RoleProtectedComponent";
import PricesProtected from "../../../protected/PricesProtected";

interface Props {
  product: IProduct;
  loading: boolean;
}

const CardContainer = styled(View)`
  padding: 8px 5px;
  margin: 10px 6px;
  width: 270px;
  height: 390px;
  border-radius: 10px;
  justify-content: space-between;
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
  background-color: ${({ theme, stock }) =>
    stock > 4
      ? hexToRgba(theme.colors.primary, 0.5)
      : stock > 0
      ? hexToRgba(theme.colors.warning, 0.5)
      : hexToRgba(theme.colors.alert, 0.4)};
  margin: -10px -6px;
  border-radius: 10px;
  padding: 5px 10px;
  color: ${({ theme }) => theme.colors.text};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DescripCont = styled(View)`
  margin-top: -20px;
  border-top: 1px solid ${({ theme }) => hexToRgba(theme.colors.secundary, 0.1)};
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
  cursor: pointer;
  font-size: 12px;
  margin: 5px 0px;
  width: 100%; /* Ancho fijo del párrafo */
  height: 120px; /* Altura fija del párrafo */
  overflow: hidden; /* Oculta cualquier texto que desborde */
  word-wrap: break-word; /* Rompe palabras largas */
  overflow-wrap: break-word; /* Rompe palabras largas */
  text-overflow: ellipsis;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

function Card(props: Props): React.ReactNode {
  const { product, loading } = props;

  const userState = useSelector((state: RootState) => state.user);

  const dispatch: AppDispatch = useDispatch();
  const discountsState = useSelector((state: RootState) => state.discounts);
  const rentabState = useSelector((state: RootState) => state.rentabilidad);

  const searchEquiv = (id: number) => {
    dispatch(SearchEquivalencesState(id));
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

  return (
    <CardContainer>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height="180px" />
      ) : (
        <ProductDetails product={product}>
          <Img
            src={
              product?.images.length > 0
                ? product?.images[0].url
                : product.equivalence?.image?.url
                ? product.equivalence?.image?.url
                : img
            }
            alt="foto"
            width="100%"
            height="180px"
            margin="0px"
            objectFit="contain"
          />
        </ProductDetails>
      )}
      <DescripCont>
        {loading ? (
          <Skeleton variant="text" width="80px" />
        ) : (
          <ProductDetails product={product}>
            <StyledSpan size="18px" weight={500}>
              <span>{product?.article.toUpperCase()}</span>
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
              <Skeleton variant="text" width="100%" />
            </>
          ) : (
            <ProductDetails product={product}>
              <span>{`${product?.brand.name.toUpperCase()}-${product?.description.toUpperCase()}`}</span>
            </ProductDetails>
          )}
        </StyledDescription>
      </DescripCont>
      <PriceContainer height="39px" stock={product.stock.stock}>
        {loading ? (
          <Skeleton variant="text" width="70px" />
        ) : (
          <ProductDetails product={product}>
            <StyledSpan size="15px" color="secundary" weight={700}>
              $
              <PricesProtected>
                {calcularSellPrice(product, discountsState.data, rentabState)}
              </PricesProtected>
            </StyledSpan>
          </ProductDetails>
        )}
        <div
          style={{
            width: "60px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            icon="balance"
            size="20px"
            onClick={() => {
              searchEquiv(product.id);
            }}
          />
          <RoleProtectedComponent accessList={[3, 4]}>
            <PricesProtected>
              <IconButton
                icon="shopping_cart"
                size="20px"
                onClick={addCartItem}
              />
            </PricesProtected>
          </RoleProtectedComponent>
        </div>
      </PriceContainer>
    </CardContainer>
  );
}

export default Card;
