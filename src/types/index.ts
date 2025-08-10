// export type HeaderData = {
//     navigationUrl: string;
// };

import { ReactNode } from "react";

// export type NavigationLink = {
//     label: string;
//     url: string;
// };

// export type ApiData = {
//     navigationUrl: string;
//     [key: string]: any;
// };

// export type NavigationData = {
//     links: NavigationLink[];
//     style?: React.CSSProperties;
//     data: {
//         api: ApiData;
//     };
// };

// export type FormField = {
//     name: string;
//     label: string;
//     type: string;
//     options?: string[];
// };

// export type FormData = {
//     fields: FormField[];
//     style?: React.CSSProperties;
// };

// working components

export type LabelComponentDataProps = {
  label: string;
};

export type LabelComponentProps = {
  data: LabelComponentDataProps;
} & ComponentProps;

export type LinkComponentDataProps = {
  label: string;
  url: string;
}

export type DataProps = LinkComponentDataProps | LabelComponentDataProps | HeaderComponentDataProps | null;

export type ComponentUpdateProps = {
  sequenceId: string;
  onSelectForEdit: (sequenceId: string) => void;
  children?: ReactNode | ReactNode[] | null
}

export type ComponentProps = {
  name: string;
  styles: React.CSSProperties;
  childs?: ComponentProps[];
  data?: DataProps
  isEditing?: boolean;
};

export type HeaderComponentDataProps = {
  label: string;
};

export type HeaderComponentProps = {
  data: HeaderComponentDataProps;
} & ComponentProps;

export type NavBarComponentProps = ComponentProps;

export type LinkComponentProps = {
  data: LinkComponentDataProps
} & ComponentProps;

export type FormComponentProps = ComponentProps;

export type ComponentName = string;
