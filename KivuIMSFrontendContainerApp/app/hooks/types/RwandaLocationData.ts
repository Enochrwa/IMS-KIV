export interface RwandaLocationData {
  [province: string]: {
    [district: string]: {
      [sector: string]: {
        [cell: string]: string[]; // villages
      };
    };
  };
}
