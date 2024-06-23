import styled from "styled-components";
import View from "../../components/atoms/view/View";
import Card from "../../components/organisms/card/Card";
import Row from "../../components/organisms/row/Row";
import Icon from "../../components/atoms/icon/Icon";
import { useEffect, useState } from "react";
import { Pagination, Popup } from "semantic-ui-react";
import Select from "../../components/atoms/select/Select";
import { hexToRgba } from "../../aux/rgbaConverter";
import { useDispatch, useSelector } from "react-redux";
import {
  ISearchProductInitialState,
  SearchProductState,
} from "../../redux/reducers/catalogoReducer";
import { AppDispatch, RootState } from "../../redux/store";
import {
  IGetBrandsInitialState,
  selectBrandById,
} from "../../redux/reducers/brandListReducers";
import { brandsSelectTab } from "../../aux/brandsSelectTab";
import { IRentaState } from "../../redux/reducers/rentabReducer";

interface Props {}

const CatalogoContainer = styled(View)`
  width: 100%;
  align-items: center;
  margin-top: 75px;
`;

const CardProductContainer = styled(View)`
  max-width: 1500px;
  margin-top: 10px;
  padding: 5px;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
`;

const TitleStyled = styled.p`
  margin-top: 30px;
  margin-bottom: 10px;
  font-size: 48px;
  font-weight: 500;
  transform: scaleY(1.03);
  transform: scalex(0.95);
  color: ${({ theme }) => theme.colors.wideText};
`;

const TitleStyledSpan = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const DescriptionStyled = styled.p`
  font-size: 13px;
  text-align: center;
  margin: 0px;
  width: 600px;
  color: ${({ theme }) => theme.colors.text};
`;

const FilterView = styled(View)<{ justifyContent?: string }>`
  flex-direction: row;
  align-items: center;
  justify-content: ${({ justifyContent }) => justifyContent || "flex-start"};
  padding: 0px 15px 15px 15px;
`;

const MuestraColor = styled.div<{ color: string; opac: number }>`
  width: 25px;
  height: 25px;
  border: 1px solid ${({ theme }) => hexToRgba(theme.colors.wideText, 0.4)};
  border-radius: 15px;
  background-color: ${({ theme, color, opac }) =>
    hexToRgba(theme.colors[color], opac)};
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Catalogo(_props: Props): React.ReactNode {
  const [grid, setGrid] = useState(true);

  const dispatch: AppDispatch = useDispatch();

  const [vehMarc, setVehMarc] = useState("");
  const [activePage, setActivePage] = useState(1);

  const catalogState: ISearchProductInitialState = useSelector(
    (state: RootState) => state.catalogo
  );

  // console.log(catalogState);

  const brandsState: IGetBrandsInitialState = useSelector(
    (state: RootState) => state.brands
  );

  const rentabState: IRentaState = useSelector(
    (state: RootState) => state.rentabilidad
  );

  const searchInput: { value: string } = useSelector(
    (state: RootState) => state.searchInput
  );

  const resetSearch = () => {
    dispatch(
      SearchProductState({
        page: 1,
        rows: grid ? 35 : 15,
      })
    ).then(() => {
      setVehMarc("");
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePageChange = (_e: unknown, data: any) => {
    if (activePage < data.activePage) {
      window.scrollTo({
        top: 138,
        behavior: "smooth", // Opcional: hace que el desplazamiento sea suave
      });
      setTimeout(() => {
        setActivePage(data.activePage);
      }, 800);
    } else {
      setActivePage(data.activePage);
    }
  };
  const getGril = (): void => {
    const preferenc: string | null = localStorage.getItem("grill");
    let viewGrill: boolean;
    if (!preferenc) {
      localStorage.setItem("grill", true.toString());
      viewGrill = true;
    } else {
      viewGrill = JSON.parse(preferenc);
    }
    setGrid(viewGrill);
  };

  useEffect(() => {
    dispatch(
      SearchProductState({
        page: activePage,
        rows: grid ? 35 : 15,
        pMarc: brandsState.select?.name,
        vMarc: vehMarc != "" ? vehMarc : undefined,
        text: searchInput.value != "" ? searchInput.value : undefined,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    grid,
    brandsState.select,
    vehMarc,
    activePage,
    searchInput,
    rentabState.loading,
  ]);
  useEffect(() => {
    getGril();
  }, [dispatch]);
  return (
    <CatalogoContainer>
      <TitleStyled>
        Catalogo de <TitleStyledSpan>Productos</TitleStyledSpan>
      </TitleStyled>
      <DescriptionStyled>
        En la vista de catálogo de productos, puedes explorar una variedad de
        artículos disponibles para la compra. Cada producto incluye una
        descripción, precio y opción para agregarlo al carrito de compras con un
        solo clic.
      </DescriptionStyled>
      <CardProductContainer width="94%">
        <FilterView width="100%" justifyContent="space-between">
          <FilterView width="618px" justifyContent="space-between">
            <Popup
              content="Ver en forma de grilla"
              trigger={
                <Icon
                  color="wideText"
                  size="22px"
                  active={grid}
                  onClick={() => {
                    setActivePage(1);
                    setGrid(true);
                    localStorage.setItem("grill", true.toString());
                  }}
                >
                  grid_view
                </Icon>
              }
            />
            <Popup
              content="Ver en forma de lista"
              trigger={
                <Icon
                  color="wideText"
                  size="25px"
                  active={!grid}
                  onClick={() => {
                    setActivePage(1);
                    setGrid(false);
                    localStorage.setItem("grill", false.toString());
                  }}
                >
                  view_list
                </Icon>
              }
            />
            <Select
              validate={false}
              placeholder="Filtro por marca del vehículo"
              width="250px"
              height="31px"
              options={[
                { key: "FIAT", value: "fiat" },
                { key: "VOLKSWAGEN", value: "volkswagen" },
                { key: "FORD", value: "ford" },
                { key: "CHEVROLET", value: "chevrolet" },
              ]}
              onSelect={(value) => {
                setActivePage(1);
                setVehMarc(value);
              }}
            />
            <Select
              validate={false}
              placeholder="Filtro por marca de producto"
              width="250px"
              height="31px"
              options={brandsSelectTab(brandsState)}
              onSelect={(value) => dispatch(selectBrandById(Number(value)))}
            />
            <Popup
              content="Limpiar criterios"
              trigger={
                <Icon
                  color="wideText"
                  size="25px"
                  active={false}
                  onClick={resetSearch}
                >
                  search_off
                </Icon>
              }
            />
          </FilterView>
          <FilterView>
            <FilterView flexDirection="row">
              <MuestraColor color="primary" opac={0.5}></MuestraColor>
              <span style={{ margin: "0px 2px" }}>Stock disponible</span>
            </FilterView>
            <FilterView flexDirection="row">
              <MuestraColor color="warning" opac={0.5}></MuestraColor>
              <span style={{ margin: "0px 2px" }}>Bajo stock</span>
            </FilterView>
            <FilterView flexDirection="row">
              <MuestraColor color="alert" opac={0.5}></MuestraColor>
              <span style={{ margin: "0px 2px" }}>Stock limitado</span>
            </FilterView>
          </FilterView>
        </FilterView>
        {catalogState.data.products.map((product, i) =>
          grid ? (
            <Card key={i} product={product} loading={catalogState.loading} />
          ) : (
            <Row key={i} product={product} loading={catalogState.loading} />
          )
        )}
      </CardProductContainer>
      <div
        style={{
          display: "flex",
          width: "65%",
          justifyContent: "space-between",
          margin: "20px 0px",
        }}
      >
        <span>{`Se han encontrado ${catalogState.data.pages} páginas con resultados.`}</span>
        <Pagination
          boundaryRange={0}
          defaultActivePage={1}
          activePage={activePage}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          siblingRange={1}
          totalPages={catalogState.data.pages}
          onPageChange={handlePageChange}
        />
      </div>
    </CatalogoContainer>
  );
}

export default Catalogo;
