// prestation.model.ts

export interface Services {
  sousPrestations: any;
  _id: string;
  libelle_service: string;
  description_service: string;
}
export interface Sous_Services {
  inCart: boolean;
  _id: string;
  id_service: string;
  libelle_detail: string;
  delai_detail: number;
  prix_detail: number;
  commission: number;
  description_detail: string;
  note_detail: number;
}
