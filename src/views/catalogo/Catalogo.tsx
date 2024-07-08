import styled from "styled-components";
import View from "../../components/atoms/view/View";
import Card from "../../components/organisms/card/Card";
import Row from "../../components/organisms/row/Row";
import Icon from "../../components/atoms/icon/Icon";
import { useEffect, useState } from "react";
import { Loader, Pagination, Popup } from "semantic-ui-react";
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
import { getAllProducts } from "../../axios/request/productsRequest";
import { IUserState } from "../../redux/reducers/userReducer";
import RoleProtectedComponent from "../../protected/RoleProtectedComponent";
import ClientFilter from "../../components/molecules/clientFilter/ClientFilter";
import { breakpoints } from "../../resolutions";

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

const FilterView = styled(View)<{ justifyContent?: string; top?: string }>`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ top }) => top || "0px"};
  justify-content: ${({ justifyContent }) => justifyContent || "flex-start"};
  padding: 0px 15px 15px 15px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    flex-direction: column;
    width: 100%;
  }
`;

const MuestraColor = styled.div<{ color: string; opac: number }>`
  width: 25px;
  height: 25px;
  border: 1px solid ${({ theme }) => hexToRgba(theme.colors.wideText, 0.4)};
  border-radius: 15px;
  background-color: ${({ theme, color, opac }) =>
    hexToRgba(theme.colors[color], opac)};
`;

const DivCont = styled(View)`
  flex-direction: row;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Catalogo(_props: Props): React.ReactNode {
  const [grid, setGrid] = useState(true);

  const dispatch: AppDispatch = useDispatch();

  const [vehMarc, setVehMarc] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [listDownloadPending, setListDownloadPending] = useState(false);

  const userState: IUserState = useSelector((state: RootState) => state.user);
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
    window.location.reload();
    // dispatch(
    //   SearchProductState({
    //     page: 1,
    //     rows: grid ? 35 : 15,
    //   })
    // ).then(() => {
    //   setVehMarc("");
    // });
  };

  const downloadList = async () => {
    setListDownloadPending(true);
    const response = await getAllProducts(userState.data?.clientId!);

    // Crea un objeto URL a partir del objeto Blob
    const fileURL = URL.createObjectURL(new Blob([response.data]));

    // Extrae el nombre del archivo de la cabecera 'content-disposition'
    const fileName = response.headers["content-disposition"]
      ? response.headers["content-disposition"]
          .split(";")
          .find((n: any) => n.includes("filename="))
          .replace("filename=", "")
          .replace(/"/g, "") // Elimina las comillas del nombre del archivo
      : "products.xlsx"; // Nombre predeterminado del archivo

    // Crea un enlace (a) para descargar el archivo
    const link = document.createElement("a");
    link.href = fileURL;
    link.setAttribute("download", fileName); // Establece el nombre del archivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setListDownloadPending(false);
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
      <CardProductContainer width="94%">
        <FilterView width="100%" justifyContent="space-between">
          <FilterView width="640px" justifyContent="space-between">
            <DivCont>
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
            </DivCont>
            <Select
              validate={false}
              placeholder="Filtro por marca del vehículo"
              width="250px"
              height="31px"
              options={[
                { key: "ALFA ROMEO", value: "alfa-romeo" },
                { key: "AUDI", value: "audi" },
                { key: "BMW", value: "bmw" },
                { key: "CHEVROLET", value: "chevrolet" },
                { key: "CITROËN", value: "citroen" },
                { key: "FIAT", value: "fiat" },
                { key: "FORD", value: "ford" },
                { key: "HONDA", value: "honda" },
                { key: "HYUNDAI", value: "hyundai" },
                { key: "JEEP", value: "jeep" },
                { key: "KIA", value: "kia" },
                { key: "LAND ROVER", value: "land-rover" },
                { key: "LEXUS", value: "lexus" },
                { key: "MAZDA", value: "mazda" },
                { key: "MERCEDES-BENZ", value: "mercedes-benz" },
                { key: "MITSUBISHI", value: "mitsubishi" },
                { key: "NISSAN", value: "nissan" },
                { key: "PEUGEOT", value: "peugeot" },
                { key: "PORSCHE", value: "porsche" },
                { key: "RENAULT", value: "renault" },
                { key: "SUBARU", value: "subaru" },
                { key: "SUZUKI", value: "suzuki" },
                { key: "TOYOTA", value: "toyota" },
                { key: "VOLKSWAGEN", value: "volkswagen" },
                { key: "VOLVO", value: "volvo" },
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
            <DivCont>
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
              {listDownloadPending ? (
                <Loader size="mini" active inline="centered" />
              ) : (
                <RoleProtectedComponent accessList={[4]}>
                  <Popup
                    content="Descargar catátalogo"
                    trigger={
                      <Icon
                        color="wideText"
                        size="25px"
                        active={false}
                        onClick={downloadList}
                      >
                        download
                      </Icon>
                    }
                  />
                </RoleProtectedComponent>
              )}
            </DivCont>
          </FilterView>
          <RoleProtectedComponent accessList={[3]}>
            <FilterView>
              <ClientFilter userId={userState.data?.userId} />
            </FilterView>
          </RoleProtectedComponent>
          <RoleProtectedComponent accessList={[4]}>
            <FilterView top="20px">
              <DivCont>
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
              </DivCont>
            </FilterView>
          </RoleProtectedComponent>
        </FilterView>
        {catalogState.data.products?.map((product, i) =>
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
