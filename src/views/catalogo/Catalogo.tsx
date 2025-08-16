/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";
import View from "../../components/atoms/view/View";
import Card from "../../components/organisms/card/Card";
import Row from "../../components/organisms/row/Row";
import Icon from "../../components/atoms/icon/Icon";
import { useEffect, useState } from "react";
import { Loader, Pagination, Popup } from "semantic-ui-react";
import Select from "../../components/atoms/select/Select";
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
import {
  getAllNews,
  getAllProducts,
} from "../../axios/request/productsRequest";
import { IUserState } from "../../redux/reducers/userReducer";
import RoleProtectedComponent from "../../protected/RoleProtectedComponent";
import { breakpoints } from "../../resolutions";
import { setSearchPage } from "../../redux/reducers/searchInputReducer";
import CustomSwiper from "../../components/molecules/swiper/CustomSwiper";
import Banner from "../../components/organisms/banner/Banner";
import { GetModeState } from "../../redux/reducers/modeReducer";

interface Props {}
/*{
    "producto": { "id": 1, "article": "A1001", "description": "Smartphone Pro X", "price": 399.99 },
    "image": "src/components/molecules/swiper/img.jpeg",
    "type": "oferta",
    "ofertas": [
      { "minimo": 2, "porcentaje": 10, "name": "Dúo Pack" },
      { "minimo": 5, "porcentaje": 20, "name": "Promo Mayorista" }
    ]
  } */
interface INews {
  producto: IProducto;
  ofertas: IOferta[];
  image: string;
  type: "oferta" | "lanzamiento";
}
interface IProducto {
  id: number;
  article: string;
  description: string;
  price: number;
}
interface IOferta {
  minimo: number;
  porcentaje: number;
  name: string;
}

const PaginationContainer = styled(View)`
  display: flex;
  width: 65%;
  justify-content: space-between;
  margin: 20px 0px;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    flex-direction: column-reverse;
    align-items: center;
  }
`;
const CatalogoContainer = styled(View)`
  width: 100%;
  align-items: center;
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
  z-index: 10;

  @media (max-width: ${breakpoints.mobileLarge}px) {
    flex-direction: column-reverse;
    width: 100%;
  }
`;

// const MuestraColor = styled.div<{ color: string; opac: number }>`
//   width: 25px;
//   height: 25px;
//   border: 1px solid ${({ theme }) => hexToRgba(theme.colors.wideText, 0.4)};
//   border-radius: 15px;
//   background-color: ${({ theme, color, opac }) =>
//     hexToRgba(theme.colors[color], opac)};
// `;

const DivCont = styled(View)<{
  color?: string;
  margin?: string;
  padding?: string;
  radius?: string;
}>`
  flex-direction: row;
  align-items: flex-start;
  background-color: ${(props) => props.color || "transparent"};
  margin: ${(props) => props.margin || "0px"};
  padding: ${(props) => props.padding || "0px"};
  border-radius: ${(props) => props.radius || "0px"};
`;
// const DivStockCont = styled(View)`
//   flex-direction: row;
//   align-items: center;
//   width: 100%;
// `;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Catalogo(_props: Props): React.ReactNode {
  const viewState = useSelector((state: RootState) => state.viewState);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [grid, _setGrid] = useState(false);
  const [newsList, setNewsList] = useState<INews[]>([]);
  const [sale] = useState(false);

  const dispatch: AppDispatch = useDispatch();

  const [vehMarc, setVehMarc] = useState("");
  const [listDownloadPending, setListDownloadPending] = useState(false);

  const userState: IUserState = useSelector((state: RootState) => state.user);
  const catalogState: ISearchProductInitialState = useSelector(
    (state: RootState) => state.catalogo
  );

  // console.log(catalogState);

  const brandsState: IGetBrandsInitialState = useSelector(
    (state: RootState) => state.brands
  );
  // console.log(brandsState);

  // const rentabState: IRentaState = useSelector(
  //   (state: RootState) => state.rentabilidad
  // );

  const searchInput: { value: string; page: number } = useSelector(
    (state: RootState) => state.searchInput
  );

  // const changeSale = (_e: any, d: any) => {
  //   handlePageChange("", { activePage: 1 });
  //   setSale(d.checked);
  // };

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
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
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
    if (searchInput.page < data.activePage) {
      window.scrollTo({
        top: 25,
        behavior: "smooth", // Opcional: hace que el desplazamiento sea suave
      });
      setTimeout(() => {
        console.log("ok");
        dispatch(setSearchPage(data.activePage));
      }, 800);
    } else {
      dispatch(setSearchPage(data.activePage));
    }
  };
  // const getGril = (): void => {
  //   const preferenc: string | null = localStorage.getItem("grill");
  //   let viewGrill: boolean;
  //   if (!preferenc) {
  //     localStorage.setItem("grill", true.toString());
  //     viewGrill = true;
  //   } else {
  //     viewGrill = JSON.parse(preferenc);
  //   }
  //   setGrid(viewGrill);
  // };
  useEffect(() => {
    getAllNews().then((res) => setNewsList(res));
  }, []);

  useEffect(() => {
    dispatch(
      SearchProductState({
        page: searchInput.page,
        rows: grid ? 35 : 15,
        pMarc: brandsState.select?.name,
        vMarc: vehMarc != "" ? vehMarc : undefined,
        text: searchInput.value != "" ? searchInput.value : undefined,
        sale: sale,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    grid,
    brandsState.select,
    vehMarc,
    searchInput,
    sale,
    // rentabState.loading,
  ]);
  // useEffect(() => {
  //   getGril();
  // }, [dispatch]);

  useEffect(() => {
    dispatch(GetModeState());
  }, [dispatch]);

  return (
    <CatalogoContainer>
      {viewState.mode == "BAN" ? <Banner /> : null}
      <CardProductContainer width="94%">
        {viewState.mode != "BAN" ? (
          <FilterView
            width="100%"
            justifyContent="space-between"
            margin={viewState.mode == "BAN" ? "0px 0px 200px 0px" : ""}
          >
            <FilterView width="640px" justifyContent="space-between">
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
                  { key: "RENAULT", value: "reno|renault" },
                  { key: "SUBARU", value: "subaru" },
                  { key: "SUZUKI", value: "suzuki" },
                  { key: "TOYOTA", value: "toyota" },
                  { key: "VOLKSWAGEN", value: "vw|volkswagen" },
                  { key: "VOLVO", value: "volvo" },
                ]}
                onSelect={(value) => {
                  dispatch(setSearchPage(1));
                  setVehMarc(value);
                }}
              />
              <Select
                validate={false}
                placeholder="Filtro por categoría"
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
                      filter_alt_off
                    </Icon>
                  }
                />
                {listDownloadPending ? (
                  <Loader size="mini" active inline="centered" />
                ) : (
                  <RoleProtectedComponent accessList={[4]}>
                    <Popup
                      content="Descargar lista"
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
            {newsList.length > 0 && viewState.mode == "OFE" ? (
              <div
                style={{
                  width: "88%",
                  marginBottom: "10px",
                  padding: "15px 25px",
                  backgroundColor: "white",
                  borderRadius: "5px",
                }}
              >
                <h2>Ofertas y lanzamientos</h2>
                <CustomSwiper list={newsList} />
              </div>
            ) : null}
          </FilterView>
        ) : (
          <div style={{zIndex: 10, width: "100%", display: "flex", justifyContent: "center", alignItems: "end", marginTop: "242px"}}>
            <FilterView width="640px" justifyContent="space-between">
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
                  { key: "RENAULT", value: "reno|renault" },
                  { key: "SUBARU", value: "subaru" },
                  { key: "SUZUKI", value: "suzuki" },
                  { key: "TOYOTA", value: "toyota" },
                  { key: "VOLKSWAGEN", value: "vw|volkswagen" },
                  { key: "VOLVO", value: "volvo" },
                ]}
                onSelect={(value) => {
                  dispatch(setSearchPage(1));
                  setVehMarc(value);
                }}
              />
              <Select
                validate={false}
                placeholder="Filtro por categoría"
                width="250px"
                height="31px"
                options={brandsSelectTab(brandsState)}
                onSelect={(value) => dispatch(selectBrandById(Number(value)))}
              />
              <DivCont color="white" margin="4px 0px 0px 10px" padding="2px 10px" radius="5px">
                <Popup
                  content="Limpiar criterios"
                  trigger={
                    <Icon
                      color="wideText"
                      size="25px"
                      active={false}
                      onClick={resetSearch}
                    >
                      filter_alt_off
                    </Icon>
                  }
                />
                {listDownloadPending ? (
                  <Loader size="mini" active inline="centered" />
                ) : (
                  <RoleProtectedComponent accessList={[4]}>
                    <Popup
                      content="Descargar lista"
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
          </div>
        )}
        {catalogState.data.list?.map((product, i) =>
          grid ? (
            <Card key={i} product={product} loading={catalogState.loading} />
          ) : (
            <Row key={i} product={product} loading={catalogState.loading} />
          )
        )}
      </CardProductContainer>
      <PaginationContainer>
        <span
          style={{ color: "white" }}
        >{`Se han encontrado ${catalogState.data.totalPages} páginas con resultados.`}</span>
        <div>
          <Pagination
            boundaryRange={0}
            defaultActivePage={1}
            activePage={searchInput.page}
            ellipsisItem={null}
            firstItem={null}
            lastItem={null}
            siblingRange={1}
            totalPages={catalogState.data.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </PaginationContainer>
    </CatalogoContainer>
  );
}

export default Catalogo;
