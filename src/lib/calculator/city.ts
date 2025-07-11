import cantonsEquador from '@/mocks/cantonsEquador.json'
import departamentosColombia from '@/mocks/departamentosColombia.json'
import departamentosGuiana from '@/mocks/departamentosGuiana.json'
import departamentosSuriname from '@/mocks/departamentosSuriname.json'
import MunicipiosCalculadora from '@/mocks/municipios_calculadora.json'
import provinciasPeru from '@/mocks/provinciasPeru.json'
import municipiosBolivia from '@/mocks/municipiosBolivia.json';
import { countryCodes } from '@/enums'

interface CityData {
    id: number;
    densidadePop2010: number;
    densidadePop2060: number;
    PopUrbMunicipio: number;
    PopRuralMunicipio: number;
    Distancia_Garimpo_Centro: number;
    Especies_por_Municipio: number;
}

interface CityDataBR extends CityData {
    município: string;
}

interface CityDataNamed extends CityData {
    nome: string;
}

function getCities(country: countryCodes) {
    switch(country) {
        case countryCodes.BR:
            return MunicipiosCalculadora;
        case countryCodes.EC:
            return cantonsEquador;
        case countryCodes.CO:
            return departamentosColombia;
        case countryCodes.GU:
            return departamentosGuiana;
        case countryCodes.SU:
            return departamentosSuriname;
        case countryCodes.PE:
            return provinciasPeru;
        case countryCodes.BO:
            return municipiosBolivia;
    }
}


export function getCityData (country: countryCodes, city: string): CityDataNamed | null {
    const cities = getCities(country);
    let cityData: CityDataNamed;
    if(country === countryCodes.BR) {
        const _city = (cities as Array<CityDataBR>).find(c => c.município === city);
        if(!_city) return null;
        cityData = {..._city, nome:_city.município}
    } else {
        const _city = (cities as Array<CityDataNamed>).find(c => c.nome === city);
        if(!_city) return null;
        cityData = _city
    }
    return cityData
}