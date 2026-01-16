import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import View from "../../components/atoms/view/View";
import { breakpoints } from "../../resolutions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { IProduct, SearchProductState } from "../../redux/reducers/catalogoReducer";
import { Magnifier } from "react-image-magnifiers";
import img from "../../assets/amortiguador-de-coche.jpg";
import { hexToRgba } from "../../aux/rgbaConverter";
import { calcularPrice, calcularSellPrice, calcularSubTotal } from "../../aux/prices";
import { searchRentab } from "../../aux/searchRentab";
import AmountInput from "../../components/molecules/amountInput/AmountInput";
import Button from "../../components/atoms/button/Button";
import RoleProtectedComponent from "../../protected/RoleProtectedComponent";
import PricesProtected from "../../protected/PricesProtected";
import { AddCartItemsState } from "../../redux/reducers/cartListReducer";
import toast from "react-hot-toast";

const PageContainer = styled(View)`
  width: 100%;
  padding: 20px 10px 40px 10px;
  align-items: center;
`;

const ContentContainer = styled(View)`
  width: 100%;
  max-width: 1100px;
  padding: 20px;
  border-radius: 4px;
  background: radial-gradient(
    circle,
    rgba(247, 255, 250, 1) 0%,
    rgba(249, 249, 249, 1) 100%
  );
  box-shadow: 0px 0px 10px -2px rgba(225, 79, 79, 0.33);
  -webkit-box-shadow: 0px 0px 10px -2px rgba(225, 79, 79, 0.33);
  -moz-box-shadow: 0px 0px 10px -2px rgba(225, 79, 79, 0.33);
  flex-direction: row;
  justify-content: space-between;

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
    padding-top: 20px;
  }
`;

const TextTitleDetail = styled.span`
  width: 100%;
  margin-top: 18px;
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

const Title = styled.h2`
  width: 100%;
  margin: 0 0 10px 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  width: 100%;
  margin: 0 0 10px 0;
  color: ${({ theme }) => theme.colors.wideText};
  font-size: 14px;
`;

const HeaderBar = styled(View)`
  width: 100%;
  max-width: 1100px;
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: ${({ theme }) => hexToRgba(theme.colors.black, 0.05)};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BreadText = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
`;

const ImageContainer = styled(View)`
  width: 100%;
  max-width: 450px;
`;

const StockText = styled.span`
  color: ${({ theme }) => theme.colors.wideText};
  font-size: 13px;
`;

const HeaderLeft = styled(View)`
  flex-direction: column;
  align-items: flex-start;
`;

const HeaderTitle = styled.h1`
  margin: 0 0 4px 0;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

const BackButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const HeaderRight = styled(View)`
  flex-direction: column;
  align-items: flex-end;
`;

const OffersContainer = styled(View)`
  width: 100%;
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) =>
    hexToRgba(theme.colors.secundary, 0.15)};
`;

const OffersTitle = styled.span`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.wideText};
  font-size: 14px;
  font-weight: 600;
`;

const OfferItem = styled.li`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
  margin-left: 16px;
  margin-bottom: 4px;
`;

const ShareRow = styled(View)`
  width: 100%;
  margin-top: 18px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const ShareLabel = styled.span`
  color: ${({ theme }) => theme.colors.wideText};
  font-size: 13px;
`;

const ShareLink = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

function Producto(): React.ReactNode {
  const { article } = useParams();
  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();
  const catalogState = useSelector((state: RootState) => state.catalogo);
  const cartState = useSelector((state: RootState) => state.cartList);
  const userState = useSelector((state: RootState) => state.user);
  const discountState = useSelector((state: RootState) => state.discounts);
  const rentabState = useSelector((state: RootState) => state.rentabilidad);

  const productFromState = useMemo(
    () =>
      catalogState.data.list.find(
        (p: IProduct) => p.article.toUpperCase() === (article || "").toUpperCase()
      ) || null,
    [catalogState.data.list, article]
  );

  const [product, setProduct] = useState<IProduct | null>(productFromState);
  const [value, setValue] = useState("1");

  useEffect(() => {
    if (!product && article) {
      dispatch(
        SearchProductState({
          page: 1,
          rows: 1,
          text: article,
        })
      );
    }
  }, [dispatch, product, article]);

  useEffect(() => {
    if (!product && article && catalogState.data.list.length > 0) {
      const found =
        catalogState.data.list.find(
          (p: IProduct) => p.article.toUpperCase() === article.toUpperCase()
        ) || null;
      if (found) {
        setProduct(found);
      }
    }
  }, [catalogState.data.list, article, product]);

  const amountProdInCart = useMemo(() => {
    if (!product) return undefined;
    return cartState.data.find((item) => item.productId === product.id);
  }, [cartState.data, product]);

  const handleChange = (v: string) => {
    setValue(v);
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
    } else if (number === 1) {
      return;
    } else {
      number--;
      setValue(number.toString());
    }
  };

  const addCartItem = () => {
    if (!product) return;
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

  const goBackToCatalog = () => {
    navigate("/catalogo");
  };

  const buildShareUrl = () => {
    if (!article) return window.location.href;
    const origin = window.location.origin;
    return `${origin}/product/${article}`;
  };

  const shareUrl = buildShareUrl();

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Mirá este producto: ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent("Mirá este producto");
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  };

  if (!article) {
    return null;
  }

  const loading = catalogState.loading && !product;

  return (
    <PageContainer>
      <HeaderBar>
        <HeaderLeft>
          <BackButton onClick={goBackToCatalog}>&larr; Volver al catálogo</BackButton>
          <HeaderTitle>Detalle de producto</HeaderTitle>
          <BreadText>
            Catálogo / Artículo {article.toUpperCase()}
          </BreadText>
        </HeaderLeft>
        <HeaderRight>
          {product && (
            <StockText>
              Stock disponible: {product.stock?.stock ?? 0}
            </StockText>
          )}
        </HeaderRight>
      </HeaderBar>
      <ContentContainer>
        <ImageContainer>
          <Magnifier
            style={{ width: "100%", height: "auto" }}
            imageSrc={
              product && product.images.length > 0
                ? product.images[0].url
                : img
            }
            imageAlt="Imagen"
            largeImageSrc={
              product && product.images.length > 0
                ? product.images[0].url
                : img
            }
          />
        </ImageContainer>
        <DetailsInfo>
          {loading && <Subtitle>Cargando producto...</Subtitle>}
          {!loading && !product && (
            <Subtitle>Producto no encontrado.</Subtitle>
          )}
          {product && (
            <>
              <Title>
                {`${product.brand.name} - Artículo ${product.article}`.toUpperCase()}
              </Title>
              <Subtitle>{product.description}</Subtitle>
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
                        product.brand.id
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
                    $
                    {calcularSellPrice(
                      product,
                      discountState.data,
                      rentabState
                    )}
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
                  onClick={addCartItem}
                />
              </RoleProtectedComponent>
              <OffersContainer>
                <OffersTitle>Ofertas y promociones</OffersTitle>
                <ul style={{ margin: 0, padding: 0 }}>
                  {product.sales?.map((sale) => (
                    <OfferItem key={`prod-${sale.id}`}>
                      {sale.referencia} - {sale.percentage * 100}% off desde {sale.minUnit} u.
                    </OfferItem>
                  ))}
                  {product.brand.sales?.map((sale) => (
                    <OfferItem key={`brand-${sale.id}`}>
                      {sale.referencia} (marca {product.brand.name}) - {sale.percentage * 100}% off desde {sale.minUnit} u.
                    </OfferItem>
                  ))}
                  {(!product.sales || product.sales.length === 0) &&
                    (!product.brand.sales || product.brand.sales.length === 0) && (
                      <OfferItem>No hay ofertas vigentes para este producto.</OfferItem>
                    )}
                </ul>
              </OffersContainer>
              <ShareRow>
                <ShareLabel>Compartir:</ShareLabel>
                <ShareLink onClick={handleShareWhatsApp}>WhatsApp</ShareLink>
                <ShareLabel>|</ShareLabel>
                <ShareLink onClick={handleShareFacebook}>Facebook</ShareLink>
                <ShareLabel>|</ShareLabel>
                <ShareLink onClick={handleShareTwitter}>Twitter</ShareLink>
              </ShareRow>
            </>
          )}
        </DetailsInfo>
      </ContentContainer>
    </PageContainer>
  );
}

export default Producto;
