import styled from "styled-components";
import ModalComponent from "../../molecules/modal/ModalComponent";
import View from "../../atoms/view/View";
import { hexToRgba } from "../../../aux/rgbaConverter";
import CustomInput from "../../molecules/input/CustomInput";
import Select from "../../atoms/select/Select";
import { brandsSelectTab } from "../../../aux/brandsSelectTab";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { IGetBrandsInitialState } from "../../../redux/reducers/brandListReducers";
import Button from "../../atoms/button/Button";
import {
  AddBrandPercentState,
  DeleteBrandPercentState,
  IRentaState,
  UpdateGralPercentState,
  changeGralInput,
} from "../../../redux/reducers/rentabReducer";
import toast from "react-hot-toast";
import { breakpoints } from "../../../resolutions";
import { useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const GeneralCard = styled(View)`
  height: 42px;
  border-radius: 20px;
  flex-direction: row;
  padding: 0px 15px;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.wideText};
  background: ${({ theme }) => `linear-gradient(
    90deg,
    ${hexToRgba(theme.colors.primary, 0.495)},
    ${hexToRgba(theme.colors.secundary, 0.6)}
  )`};
`;

const BrandCard = styled(View)`
  margin: 2px 0px;
  height: 42px;
  flex-direction: row;
  padding: 0px 15px;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.wideText};
  border-bottom: 1px solid ${({ theme }) => theme.colors.medium};
`;

const AddContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  width: 50%;
  justify-content: space-between;

  @media (max-width: ${breakpoints.mobileSmall}px) {
    flex-direction: column;
    align-items: flex-start;
    height: 110px;
  }
`;

const ListBrandContainer = styled(View)`
  margin-top: 20px;
  align-items: start;
  width: 100%;
  height: 400px;
  overflow-y: auto;
`;

const Icon = styled.span<{ active: boolean; size?: string; color?: string }>`
  font-size: ${({ size }) => size || "30px"};
  margin-left: 10px;
  cursor: ${({ active }) => (active ? "pointer" : "")};
  color: ${({ active, theme, color }) =>
    !active
      ? ""
      : color
      ? hexToRgba(theme.colors[color], 0.6)
      : theme.colors.secundary};

  &:hover {
    color: ${({ theme, active, color }) =>
      !active
        ? ""
        : color
        ? hexToRgba(theme.colors[color], 1)
        : theme.colors.primary};
  }
`;

function Rentab(props: Props): React.ReactNode {
  const { children } = props;

  const userState = useSelector((state: RootState) => state.user);

  const [brand, setBrand] = useState(null);
  const [percentValue, setPercentValue] = useState("0");
  const [gralActiveButton, setGralActiveButton] = useState(false);

  const addBrandRent = () => {
    if (!brand) {
      toast.error("Seleccionar la marca");
      return;
    }
    if (isNaN(Number(percentValue)) || Number(percentValue) <= 0) {
      toast.error("El porcentaje no es válido");
      return;
    }
    dispatch(
      AddBrandPercentState({
        percentage: Number(percentValue) / 100,
        clientId: userState.data?.clientId || 0,
        brandId: Number(brand),
      })
    )
      .then((res: any) => {
        if (res?.error) {
          toast.error(res.error.message);
          return;
        } else {
          toast.success("Agregado con éxito");
        }
      })
      .catch((err) => {
        toast.error(err.error.message);
        return;
      });
  };

  const updateGralRent = () => {
    if (!gralActiveButton) return;
    dispatch(
      UpdateGralPercentState({
        id: rentabState.general.id,
        percentage: rentabState.general.surchargePercentage,
      })
    )
      .then((res: any) => {
        if (res?.error) {
          toast.error(res.error.message);
        } else {
          toast.success("Coeficiente actualizado");
          setGralActiveButton(false);
        }
      })
      .catch((err) => {
        toast.success(err.message);
      });
  };

  const changeGralRent = (value: string) => {
    if (isNaN(Number(value))) {
      toast.error("Solo se permiten numeros");
      return;
    }
    dispatch(changeGralInput(value));
    setGralActiveButton(true);
  };

  const deleteRentToBrand = (id: number) => {
    dispatch(DeleteBrandPercentState(id));
  };

  const rentabState: IRentaState = useSelector(
    (state: RootState) => state.rentabilidad
  );

  const dispatch: AppDispatch = useDispatch();

  const brandsState: IGetBrandsInitialState = useSelector(
    (state: RootState) => state.brands
  );
  const { pathname } = useLocation();

  const close = () => {
    if (pathname == "/catalogo" || pathname == "/") {
      window.location.reload();
    }
  };

  return (
    <ModalComponent
      title="CONFIGURACIÓN DE RENTABILIDAD"
      button={children}
      size="1000px"
      closeFn={close}
    >
      <GeneralCard>
        <span>Coeficiente de rentabilidad general</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <CustomInput
            width="35px"
            icon="percent"
            value={`${rentabState.general.surchargePercentage * 100}`}
            onChange={changeGralRent}
          />
          <Icon
            className="material-symbols-outlined"
            active={gralActiveButton}
            onClick={updateGralRent}
          >
            check_circle
          </Icon>
        </div>
      </GeneralCard>
      <AddContainer height="37px" margin="10px 0px">
        <Select
          validate={false}
          placeholder="Seleccioná la marca"
          width="250px"
          height="35px"
          options={brandsSelectTab(brandsState)}
          onSelect={(value) => setBrand(value)}
        />
        <CustomInput
          width="35px"
          icon="percent"
          value={percentValue}
          onChange={(value) => setPercentValue(value)}
        />
        <Button
          invert
          color="wideText"
          text="Agregar"
          height="25px"
          onClick={addBrandRent}
        />
      </AddContainer>
      <ListBrandContainer>
        {rentabState.byBrand.map((brand, i) => (
          <BrandCard width="100%" key={i}>
            <span>{brand.brand?.name}</span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>{(brand.surchargePercentage * 100).toFixed(2)}%</span>
              <Icon
                color="alert"
                className="material-symbols-outlined"
                size="20px"
                active={true}
                onClick={() => deleteRentToBrand(brand.id)}
              >
                delete_forever
              </Icon>
            </div>
          </BrandCard>
        ))}
      </ListBrandContainer>
    </ModalComponent>
  );
}
export default Rentab;
