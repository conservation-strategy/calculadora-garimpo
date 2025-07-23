import { useForm } from "react-hook-form";
import * as S from './style';
import useAppContext from "@/hooks/useAppContext";
import * as SG from '@/styles/global';
import Options from "../FormCalculator/Options";
import { usesValuesTypes } from "@/enums";
import { useState } from "react";

interface FormInputs {
    pitdepth: string;
    valueHypothesis: string;
    usesTypes: '1' | '2' | '3';
}

export default function FormMap() {
    const { state, changeCountry, changeDataCalculator } = useAppContext();
    const { language } = state
    const { calculator } = language
    const { form } = calculator
    const {
        register,
        getValues,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm<FormInputs>();
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    return (
        <S.Form>
            <S.FormControlPit>
                <label>{form.pitdepth.label}</label>
                <SG.Select {...register('pitdepth')}>
                    <Options data={form.pitdepth.options} />
                </SG.Select>
            </S.FormControlPit>
            <S.FormControlHypothesis>
                <label>{form.valueHypothesis.label}</label>
                <SG.Select {...register('valueHypothesis')}>
                <Options data={form.valueHypothesis.options} />
                </SG.Select>
            </S.FormControlHypothesis>
            <S.FormControlUse>
                <label>{form.useCalculator.headline}</label>
                <SG.Select {...register('usesTypes')}>
                <option value={usesValuesTypes.environmental}>
                    {form.useCalculator.paragraphy_01}
                </option>
                <option value={usesValuesTypes.planning}>
                    {form.useCalculator.paragraphy_02}
                </option>
                <option value={usesValuesTypes.technology}>
                    {form.useCalculator.paragraphy_03}
                </option>
                </SG.Select>
            </S.FormControlUse>
            <S.ButtonSubmit id="btn-calcular" variant="primary" disabled={isButtonDisabled}>            
                <span style={isButtonDisabled ? { opacity: .5 } : {}}>{form.btn_calculator.btn}</span>
                {isButtonDisabled && <S.LoadingSpinner/>}
            </S.ButtonSubmit>
        </S.Form>
    )
}