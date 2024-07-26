export class CityModel {
  label: string | undefined | null;
  value: string | undefined | null;
  label_en: string | undefined | null;
  children: string[] | undefined | null;
  children_en: string[] | undefined | null;
}

export class CountryModel {
  label: string | undefined | null;
  value: string | undefined | null;
  label_en: string | undefined | null;
  children: CityModel[] | undefined | null;
}

// 解析数据
export const parseCountryData = (jsonData: any) => {
  if (jsonData === undefined || jsonData === null) {
    return null;
  }

  const allCountryKey = Object.keys(jsonData).sort();
  const parsedDatas = allCountryKey.map((countryKey: any) => {
    // CLOG.info(countryKey);
    // CLOG.info(jsonData[countryKey]);
    // CLOG.info(`\n`);

    const { label, value, label_en, children } = jsonData[countryKey];
    // const allCityKey = Object.keys(children).sort();

    const countryModel: CountryModel = {
      label: label,
      value: value,
      label_en: label_en,
      children: children,
    };

    // CLOG.info(countryModel);
    // CLOG.info(`\n`);

    return countryModel;
  });

  return parsedDatas;
};

export class PhoneCountryModel {
  english_name: string | undefined | null;
  chinese_name: string | undefined | null;
  country_code: string | undefined | null;
  phone_code: string | undefined | null;
}
