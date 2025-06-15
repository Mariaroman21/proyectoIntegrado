export interface Plan {
  id: string;
  plan: string;

}

export interface Couple {
  id: string;
  start_date: string;
  plans: Plan[];
}
