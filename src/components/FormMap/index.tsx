import { useForm } from "react-hook-form";
import * as S from './style';
import useAppContext from "@/hooks/useAppContext";
import * as SG from '@/styles/global';
import Options from "../FormCalculator/Options";
import { usesValuesTypes } from "@/enums";
import { useState } from "react";

interface FormMapProps {
    onSubmit: () => void;
}

export interface FormInputs {
    pitDepth: string;
    valueHypothesis: string;
    usesTypes: '1' | '2' | '3';
}

export const formDefaultValues: FormInputs = {
    pitDepth: '2.5',
    valueHypothesis: '0.29',
    usesTypes: '1'
};

export default function FormMap(props : FormMapProps) {
    const { state, changeCountry, changeDataCalculator } = useAppContext();
    const { language } = state
    const { calculator } = language
    const { form } = calculator
    const {
        register,
        getValues,
        watch,
        setValue,
        // setError,
        // clearErrors,
        // formState: { errors }
    } = useForm<FormInputs>({
        defaultValues: formDefaultValues
    });
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const { onSubmit } = props;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <S.Form onSubmit={handleSubmit}>
            <S.FormControlPit>
                <label>{form.pitdepth.label}</label>
                <SG.Select {...register('pitDepth')}>
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