import useAppContext from '@/hooks/useAppContext'
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CountryList } from '@/components/SelectedCountry'

import * as S from './style'
import * as SCalc from '../pages/Calculator/style'
import * as SG from '@/styles/global'
import useCountry from '@/hooks/useCountry'
import Options, { OptionsWithStandartFlagging } from './Options'
import {
  analysisUnitTypes,
  countryCodes,
  // knowMachineCapacityTypes,
  knowRegionTypes,
  typeMiningTypes,
  usesValuesTypes
} from '@/enums'
import stateBrazil from '@/mocks/state.json'
import statePeru from '@/mocks/statePeru.json'
import stateEquador from '@/mocks/stateEquador.json'
import stateBolivia from '@/mocks/stateBolivia.json'
import useCalculator from '@/hooks/useCalculator'
import useResize from '@/hooks/useResize'
// import { relative } from 'path'
import { event as gaEvent } from "nextjs-google-analytics";
// import useInflation from '@/hooks/useInflation'
// import useGoldPrice from '@/hooks/useGoldPrice'
import { usePriceData } from '@/store/api'

export interface FormInputs {
  knowRegion: string
  isProtectedArea: '0' | '1'
  country: string
  state: string
  district: string
  typeMining: '0' | '1' | '2'
  retort: string
  analysisUnit: '1' | '2' | '3' | '5' | '6'
  qtdAnalysis: string
  motorPower: string
  pitdepth: string
  valueHypothesis: string
  inflation: string
  usesTypes: '1' | '2' | '3'
  knowMachineCapacity: string | null
  machineCapacity: string | null
}

type LanguageId = 'pt_BR' | 'en_US' | 'es_ES';

const CountryDictionary: Record<LanguageId, Record<countryCodes, string>> = {
  'pt_BR': {
    [countryCodes.BO]: 'Bolívia',
    [countryCodes.BR]: 'Brasil',
    [countryCodes.EC]: 'Equador',
    [countryCodes.PE]: 'Perú',
    [countryCodes.CO]: 'Colômbia',
    [countryCodes.GU]: 'Guiana',
    [countryCodes.SU]: 'Suriname'
  },
  'en_US': {
    [countryCodes.BO]: 'Bolivia',
    [countryCodes.BR]: 'Brazil',
    [countryCodes.EC]: 'Ecuador',
    [countryCodes.PE]: 'Peru',
    [countryCodes.CO]: 'Colombia',
    [countryCodes.GU]: 'Guiana',
    [countryCodes.SU]: 'Suriname'
  },
  'es_ES': {
    [countryCodes.BO]: 'Bolivia',
    [countryCodes.BR]: 'Brasil',
    [countryCodes.EC]: 'Ecuador',
    [countryCodes.PE]: 'Perú',
    [countryCodes.CO]: 'Colombia',
    [countryCodes.GU]: 'Guyana',
    [countryCodes.SU]: 'Surinam'
  }
}


export default function FormCalculator() {
  const [stateListForCountry, setStateListForCountry] =
    useState<any>(stateBrazil)
  const [ standartMotorPower, setStandartMotorPower ] = useState("55");
  const { state, changeCountry, changeDataCalculator } = useAppContext()
  const {
    isBrazil,
    isPeru,
    isColombia,
    isEquador,
    isGuiana,
    isSuriname,
    isBolivia,
    district: districtList,
    currentCountry: country,
    getDistrictForState
  } = useCountry({
    initialState: {
      district: (value) => setValue('district', value.id)
    }
  })
  const { language } = state
  const { calculator } = language
  const { form } = calculator
  const {
    typeMining,
    pitdepth,
    motorPower,
    retort,
    valueHypothesis,
    inflation
  } = form

  const {
    register,
    getValues,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm<FormInputs>({
    defaultValues: {
      knowRegion: knowRegionTypes.YES,
      retort: '1',
      analysisUnit: '1',
      usesTypes: '1',
      machineCapacity: '70'
    }
  })

  const { getcalculator } = useCalculator()
  const { isMobile } = useResize()
  const typeMiningValue = watch('typeMining')
  const analysisUnit = watch('analysisUnit')
  const country_field = watch('country')
  const knowRegion_field = watch('knowRegion')
  // const knowCapacity = watch('knowMachineCapacity');
  const _state = watch('state');
  const { isLoadingInflationData } = usePriceData();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const buttonTimeout = useRef<NodeJS.Timeout | null>(null);
  // console.log('current state', _state)
  
  // console.log('country field', country_field);

  // const inflationData = useInflation(country?.country);
  // const goldPriceData = useGoldPrice();

  // console.log('gold price', goldPriceData);

  useEffect(() => {
    if(isLoadingInflationData) {
      setIsButtonDisabled(true)
    } else {
      buttonTimeout.current = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 500);
    }
  }, [isLoadingInflationData])

  useEffect(() => {
    const value = Number(typeMiningValue)
    if (value === typeMiningTypes.ALLUVION) {
      setValue('analysisUnit', '1')
    } else if (value === typeMiningTypes.FERRY) {
      setValue('analysisUnit', '5')
    } else if (value === typeMiningTypes.PIT) {
      setValue('analysisUnit', '3')
    }
  }, [setValue, typeMiningValue])

  useEffect(() => {
    if (country_field) {
      const findCountry = CountryList.filter(
        (country) => country.country === country_field
      )
      changeCountry(findCountry[0])

      if (findCountry[0]) {
        if (
          findCountry[0].country === 'BR' ||
          findCountry[0].country === 'EC'
        ) {
          setValue('motorPower', '55')
          setStandartMotorPower('55')
        } else if (findCountry[0].country === 'PE') {
          setValue('motorPower', '130')
          setStandartMotorPower('55')
        } else if (findCountry[0].country === 'CO') {
          setValue('motorPower', '100')
          setStandartMotorPower('55')
        } else if(findCountry[0].country === 'BO') {
          setValue('motorPower', '100')
          setStandartMotorPower('100')
        }
      }
      // console.log('motorPower', motor_power)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country_field])

  useEffect(() => {
    if (country && !country_field) {
      setValue('country', country.country)
      const findCountry = CountryList.find((c) => c.country === country_field)
      if (findCountry) {
        changeCountry(findCountry)
        if (findCountry.country === 'BR' || findCountry.country === 'EC') {
          setValue('motorPower', '55')
          setStandartMotorPower('55');
        } else if (findCountry.country === 'PE') {
          setValue('motorPower', '130')
          setStandartMotorPower('55');
        } else if (findCountry.country === 'CO') {
          setValue('motorPower', '100')
          setStandartMotorPower('55');
        } else if (findCountry.country === 'BO') {
          setValue('motorPower', '100')
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country])

  useEffect(() => {
    if (isBrazil) {
      setStateListForCountry(stateBrazil)
      // setValue('state', `${stateBrazil[0].id}`)
    } else if (isPeru) {
      setStateListForCountry(statePeru)
    } else if (isEquador) {
      setStateListForCountry(stateEquador)
    } else if (isBolivia) {
      setStateListForCountry(stateBolivia)
    }
  }, [isBrazil, isPeru, isEquador])

  useEffect(() => {
    if(
      country_field !== 'PE' && 
      Number(analysisUnit) === analysisUnitTypes.QTD_MACHINES
    ) {
      setValue(
        'analysisUnit', 
        `${form.analysisUnit.options[typeMiningValue][0].value as analysisUnitTypes}`
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country_field])

  // useEffect(() => {
  //   if(analysisUnit === `${analysisUnitTypes.QTD_MACHINES}`) {
  //     // setValue(
  //     //   'knowMachineCapacity', knowMachineCapacityTypes.NO
  //     // );
  //     setValue(
  //       'machineCapacity', `${form.suggestedMachineCapacity.options[0]}`
  //     );
  //   }
  // }, [analysisUnit])

  // useEffect(() => {
  //   if(knowCapacity === knowMachineCapacityTypes.NO) {
  //     // setTimeout(() => {}, 20);
  //     setValue(
  //       'machineCapacity',
  //       `${form.suggestedMachineCapacity.options[0]}`
  //     )
  //   } else {
  //     console.log('changing capacity')
  //     setValue('machineCapacity', null)
  //   }
  // }, [knowCapacity])

  useEffect(() => {
    setValue('state', stateListForCountry[0].id)
  }, [knowRegion_field]);


  const handleState = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value
      setValue('state', value)
      getDistrictForState(Number(value))
    },
    [getDistrictForState, setValue]
  )

  useEffect(() => {
    // console.log('setting district...')
    // console.log('districtList', districtList);
    if(districtList.length){
      setValue('district', districtList[0].id);
    }
  }, [_state, districtList]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const analysisUnit = Number(getValues('analysisUnit'))
      const qtdAnalysis = Number(getValues('qtdAnalysis'))
      const machineCap = Number(getValues('machineCapacity'))
      if (!qtdAnalysis || qtdAnalysis < 0) {
        if (analysisUnit === analysisUnitTypes.AMOUNT_GOLD) {
          setError('qtdAnalysis', { message: form.qtdAnalysis[2].error })
        } else if (analysisUnit === analysisUnitTypes.IMPACTED_AREA) {
          setError('qtdAnalysis', { message: form.qtdAnalysis[1].error })
        } else if (analysisUnit === analysisUnitTypes.QTD_FERRY) {
          setError('qtdAnalysis', { message: form.qtdAnalysis[5].error })
        } else if (analysisUnit === analysisUnitTypes.YEARS_OF_MINING) {
          setError('qtdAnalysis', { message: form.qtdAnalysis[3].error })
        } else if (analysisUnit === analysisUnitTypes.QTD_MACHINES) {
          setError('qtdAnalysis', { message: form.qtdAnalysis[6].error})
        }
        changeDataCalculator(null)
      } else if (
        analysisUnit === analysisUnitTypes.QTD_MACHINES &&
        (!machineCap || machineCap < 0 || isNaN(machineCap))
      ) {
        clearErrors('qtdAnalysis')
        setError('machineCapacity', { message: form.openMachineCapacity.error })
      } else {
        clearErrors('qtdAnalysis')
        clearErrors('machineCapacity')
        changeDataCalculator(getValues())
        getcalculator(getValues())
        gaEvent("submit_form", {
          form_name: "Calculator"
        });
      }
    },
    [
      changeDataCalculator,
      clearErrors,
      form.qtdAnalysis,
      getValues,
      getcalculator,
      setError
    ]
  )

  let district = form.district.label

  if (isPeru) {
    district = 'Provincia'
  } else if (isEquador) {
    district = 'Cantón'
  } else if (isColombia) {
    district = 'Departamento'
  } else if (isGuiana) {
    district = 'Región'
  } else if (isSuriname) {
    district = 'Provincia'
  }

  let stateName = form.state.stateBrasil

  if (isPeru || isBolivia) {
    stateName = form.state.statePeru
  } else if (isEquador) {
    stateName = form.state.stateEquador
  }

  let FormControlPitDepthOrMotorPower = null

  if (Number(typeMiningValue) === typeMiningTypes.ALLUVION) {
    FormControlPitDepthOrMotorPower = (
      <S.FormControlPitDepthOrMotorPower>
        <label>{pitdepth.label}</label>
        <SG.Select {...register('pitdepth')}>
          <Options data={pitdepth.options} />
        </SG.Select>
      </S.FormControlPitDepthOrMotorPower>
    )
  } else if (
    Number(typeMiningValue) === typeMiningTypes.FERRY &&
    Number(analysisUnit) === analysisUnitTypes.QTD_FERRY
  ) {
    const flag = motorPower.default
    FormControlPitDepthOrMotorPower = (
      <S.FormControlPitDepthOrMotorPower>
        <label>{motorPower.label}</label>
        <SG.Select {...register('motorPower')}>
          <OptionsWithStandartFlagging data={motorPower.options} standart={{ value: standartMotorPower, flag }} />
        </SG.Select>
      </S.FormControlPitDepthOrMotorPower>
    )
  }
  
  let FormControlMachineCapacity = null

  if(analysisUnit === '6') {
    FormControlMachineCapacity = (
      <>
      {/* <S.FormControlKnowMachineCapacity>
        <label>{form.knowMachineCapacity.label}</label>
        <SG.Select {...register('knowMachineCapacity')}>
          {form.knowMachineCapacity.options.map((opt) => (
            <option key={opt.text} value={opt.value}>
              {opt.text}
            </option>
          ))}
        </SG.Select>
      </S.FormControlKnowMachineCapacity>
      {knowCapacity === '0'
        ? <S.FormControlMachineCapacity>
            <label>{form.suggestedMachineCapacity.label}</label>
            <SG.Select {...register('machineCapacity')}>
              {form.suggestedMachineCapacity.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </SG.Select>
          </S.FormControlMachineCapacity>
        : <S.FormControlMachineCapacity>
            <label>{form.openMachineCapacity.label}</label>
            <div style={{ position: 'relative' }}>
              <SG.Input
              onWheel={(e: FormEvent<HTMLInputElement>) => e.currentTarget.blur()}
              error={errors.machineCapacity !== undefined}
              type="number"
              {...register('machineCapacity')}
              placeholder={"0"}
              />
              <SG.InputUnit>m³/h</SG.InputUnit>
            </div>
            {errors.machineCapacity && (
              <S.MessageError>{errors.machineCapacity.message}</S.MessageError>
            )}
          </S.FormControlMachineCapacity>
      } */}
      <S.FormControlMachineCapacity>
        <label>{form.suggestedMachineCapacity.label}</label>
        <SG.Select {...register('machineCapacity')}>
          {form.suggestedMachineCapacity.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt === 70 ? `${opt} ${form.suggestedMachineCapacity.standart}` : opt}
            </option>
          ))}
        </SG.Select>
      </S.FormControlMachineCapacity>      
      </>
    )
  }


  let FormControlProtectedArea = null

  if(
    country?.country === 'BO' && 
    knowRegion_field === knowRegionTypes.YES
  ) {
    FormControlProtectedArea = (
      <S.FormControlProtectedArea>
        <label>{form.isProtectedArea.label}</label>
        <SG.Select {...register('isProtectedArea')}>
          {form.isProtectedArea.options.map((opt) => (
            <option key={opt.text} value={opt.value}>
              {opt.text}
            </option>
          ))}
        </SG.Select>
      </S.FormControlProtectedArea>      
    )
  }

  const formControlCityStyles = isMobile
    ? undefined
    : { gridArea: 'knowRegion', marginTop: '115px', marginBottom: '-15px' }
  const formControlValueHypothesisStyles = isMobile
    ? undefined
    : {
        gridArea: !FormControlPitDepthOrMotorPower
          ? 'pitDepth'
          : 'valueHypothesis'
      }

  return (
    <SCalc.Form
    knowRegion={knowRegion_field === "1"} 
    isProtectedAreaVisible={FormControlProtectedArea !== null} 
    onSubmit={handleSubmit} 
    hasUF={!!isBrazil || !!isPeru || !!isEquador || !!isBolivia}
    >
      {country && (
        <S.FormControlCountry>
          <label htmlFor="country">{form.country.label}</label>
          <SG.Select {...register('country')}>
            {[...CountryList].sort((a, b) => a.label.localeCompare(b.label)).map((country) => (
              <option key={country.label} value={country.country}>
                {CountryDictionary[language.id as LanguageId][country.country]}
              </option>
            ))}
          </SG.Select>
        </S.FormControlCountry>
      )}

      <S.FormControlKnowRegion>
        <label>{form.knowRegion.label}</label>
        <SG.Select {...register('knowRegion')}>
          {form.knowRegion.options.map((opt) => (
            <option key={opt.text} value={opt.value}>
              {opt.text}
            </option>
          ))}
        </SG.Select>
      </S.FormControlKnowRegion>

      {FormControlProtectedArea}

      {knowRegion_field === knowRegionTypes.YES ? (
        isBrazil || isPeru || isEquador || isBolivia ? (
          <>
            <S.FormControlState>
              <label>{stateName}</label>
              <SG.Select {...register('state')} onChange={handleState}>
                {stateListForCountry.map(
                  (stateItem: { id: string | number; sigla: string }) => {
                    return (
                      <option key={stateItem.id} value={Number(stateItem.id)}>
                        {stateItem.sigla}
                      </option>
                    )
                  }
                )}
              </SG.Select>
            </S.FormControlState>

            <S.FormControlCity>
              <label>{district}</label>
              <SG.Select {...register('district')}>
                {districtList.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.nome}
                  </option>
                ))}
              </SG.Select>
            </S.FormControlCity>
          </>
        ) : (
          <>
            <S.FormControlCity>
              <label>{district}</label>
              <SG.Select {...register('district')}>
                {districtList.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.nome}
                  </option>
                ))}
              </SG.Select>
            </S.FormControlCity>
          </>
        )
      ) : (
        <></>
      )}

      <S.FormControlTypeMining>
        <label>{typeMining.label}</label>
        <SG.Select {...register('typeMining')}>
          <Options data={typeMining.options} />
        </SG.Select>
      </S.FormControlTypeMining>

      <S.FormControlRetort>
        <label htmlFor="retort">{retort.label}</label>
        <SG.Select id="retort" {...register('retort')}>
          <Options data={retort.options} />
        </SG.Select>
      </S.FormControlRetort>

      <S.FormControlUnitAnalysis>
        <label htmlFor="analysisUnit">{form.analysisUnit.label}</label>
        <SG.Select id="analysisUnit" {...register('analysisUnit')}>
          {typeMiningValue && (
            <Options data={ country?.country === 'PE' 
              ? form.analysisUnit.options.peru![typeMiningValue] 
              : form.analysisUnit.options[typeMiningValue]} 
            />
          )}
        </SG.Select>
      </S.FormControlUnitAnalysis>

      <S.FormControlHectare>
        <label>{analysisUnit && form.qtdAnalysis[analysisUnit].label}</label>
        <SG.Input
          onWheel={(e: FormEvent<HTMLInputElement>) => e.currentTarget.blur()}
          error={errors.qtdAnalysis !== undefined}
          type="number"
          {...register('qtdAnalysis')}
          placeholder={analysisUnit && form.qtdAnalysis[analysisUnit].label}
        />
        {errors.qtdAnalysis && (
          <S.MessageError>{errors.qtdAnalysis.message}</S.MessageError>
        )}
      </S.FormControlHectare>

      {FormControlPitDepthOrMotorPower}

      {FormControlMachineCapacity}

      <S.FormControlValueHypothesis style={formControlValueHypothesisStyles}>
        <label>{valueHypothesis.label}</label>
        <SG.Select {...register('valueHypothesis')}>
          <Options data={valueHypothesis.options} />
        </SG.Select>
      </S.FormControlValueHypothesis>

      {/* <S.FormControlInflation>
        <label>{inflation.label}</label>
        <SG.Input
          type="number"
          {...register('inflation')}
          placeholder={inflation.placeholder}
        />
      </S.FormControlInflation> */}

      <S.FormControlUsesTypes>
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
      </S.FormControlUsesTypes>

      <S.ButtonSubmit id="btn-calcular" variant="primary" disabled={isButtonDisabled}>
        {/* {isLoadingInflationData
          ? <S.LoadingSpinner/> 
          : form.btn_calculator.btn
        } */}
        <span style={isButtonDisabled ? { opacity: .5 } : {}}>{form.btn_calculator.btn}</span>
        {isButtonDisabled && <S.LoadingSpinner/>}
      </S.ButtonSubmit>
    </SCalc.Form>
  )
}
