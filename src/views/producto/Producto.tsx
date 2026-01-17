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
import { GetBrandPaymentMethodDiscounts, IBrandPaymentMethodDiscount } from "../../axios/request/brandPaymentDiscountRequest";

const PageContainer = styled(View)`
  width: 100%;
  min-height: 100vh;
  padding: 59px 20px 40px 20px;
  align-items: center;
  background: rgba(245, 247, 250, 1);
`;

const ContentContainer = styled(View)`
  width: 100%;
  max-width: 1200px;
  flex-direction: row;
  justify-content: center;
  gap: 50px;
  margin-top: 20px;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
`;

const DetailsInfo = styled(View)`
  flex: 1;
  max-width: 500px;
  flex-direction: column;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    max-width: 95%;
    padding-top: 10px;
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
  max-width: 1200px;
  padding: 0 10px;
  margin-bottom: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BreadText = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-size: 13px;
`;

const ImageContainer = styled(View)`
  flex: 1.2;
  max-width: 650px;
  align-items: center;
  justify-content: flex-start;
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
  font-size: 24px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const BackButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 8px;

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

const PaymentOffersContainer = styled(View)`
  width: 100%;
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px solid ${({ theme }) =>
    hexToRgba(theme.colors.secundary, 0.15)};
`;

const PaymentOffersTitle = styled.span`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.wideText};
  font-size: 14px;
  font-weight: 600;
`;

const PaymentOfferItem = styled.li`
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

const ShareIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    color: ${({ theme }) => hexToRgba(theme.colors.primary, 0.8)};
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
  const [paymentDiscounts, setPaymentDiscounts] = useState<IBrandPaymentMethodDiscount[]>([]);
  const [loadingPaymentDiscounts, setLoadingPaymentDiscounts] = useState(false);

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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    const fetchBrandPaymentDiscounts = async () => {
      if (!product) return;
      try {
        setLoadingPaymentDiscounts(true);
        const discounts = await GetBrandPaymentMethodDiscounts(product.brand.id);
        setPaymentDiscounts(discounts.filter((d) => d.active));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPaymentDiscounts(false);
      }
    };

    fetchBrandPaymentDiscounts();
  }, [product]);

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

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    const title = encodeURIComponent("Mirá este producto");
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`,
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
            style={{
              width: "100%",
              height: "auto",
            }}
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
                {product.brand.name.toUpperCase()} - {product.article.toUpperCase()}
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
                      {sale.referencia} (En {product.brand.name}) - {sale.percentage * 100}% off desde {sale.minUnit} unidades.
                    </OfferItem>
                  ))}
                  {(!product.sales || product.sales.length === 0) &&
                    (!product.brand.sales || product.brand.sales.length === 0) && (
                      <OfferItem>No hay ofertas vigentes para este producto.</OfferItem>
                    )}
                </ul>
              </OffersContainer>
              <PaymentOffersContainer>
                <PaymentOffersTitle>Promociones por medios de pago</PaymentOffersTitle>
                <ul style={{ margin: 0, padding: 0 }}>
                  {loadingPaymentDiscounts && (
                    <PaymentOfferItem>Cargando promociones...</PaymentOfferItem>
                  )}
                  {!loadingPaymentDiscounts &&
                    paymentDiscounts.map((discount) => (
                      <PaymentOfferItem key={discount.id}>
                        {discount.paymentMethod}: {discount.percentage * 100}% off
                        {discount.notes ? ` - ${discount.notes}` : ""}
                      </PaymentOfferItem>
                    ))}
                  {!loadingPaymentDiscounts && paymentDiscounts.length === 0 && (
                    <PaymentOfferItem>
                      No hay promociones por medios de pago vigentes para esta marca.
                    </PaymentOfferItem>
                  )}
                </ul>
              </PaymentOffersContainer>
              <ShareRow>
                <ShareLabel>Compartir:</ShareLabel>
                <ShareIcon onClick={handleShareWhatsApp}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </ShareIcon>
                <ShareLabel>|</ShareLabel>
                <ShareIcon onClick={handleShareFacebook}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </ShareIcon>
                <ShareLabel>|</ShareLabel>
                <ShareIcon onClick={handleShareLinkedIn}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </ShareIcon>
              </ShareRow>
            </>
          )}
        </DetailsInfo>
      </ContentContainer>
    </PageContainer>
  );
}

export default Producto;
