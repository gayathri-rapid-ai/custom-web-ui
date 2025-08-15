// export type HeaderData = {
//     navigationUrl: string;
// };

import { ReactNode, SyntheticEvent } from "react";

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


export type LinkComponentDataProps = {
  label: string;
  url: string;
}

export type InputComponentDataProps = {
  label: string;
  inputType: "string" | "number";
  placeHolder?: string;
}

export type DataProps = LinkComponentDataProps | LabelComponentDataProps | HeaderComponentDataProps | InputComponentDataProps | null;

export type ComponentUpdateProps = {
  sequenceId: string;
  onSelectForEdit?: (sequenceId: string) => void;
  children?: ReactNode | ReactNode[] | null
  onEditStyles: (styles: React.CSSProperties) => void;
  isEditingMode: boolean
  isEditing?: boolean;
}

export type ComponentRenderProps = {
  name: string;
  styles: React.CSSProperties;
  childs?: ComponentProps[];
  data?: DataProps
  use_common?: boolean
};

export type ComponentProps = ComponentRenderProps & ComponentUpdateProps

export type HeaderComponentDataProps = {
  label: string;
};

export type HeaderComponentProps = {
  data: HeaderComponentDataProps;
} & ComponentRenderProps;

export type LabelComponentProps = {
  data: LabelComponentDataProps;
} & ComponentRenderProps;

export type NavBarComponentProps = ComponentProps;

export type LinkComponentProps = {
  data: LinkComponentDataProps
} & ComponentRenderProps;

export type InputComponentProps = {
  data: InputComponentDataProps
} & ComponentRenderProps

export type FormComponentProps = ComponentRenderProps;

export type ComponentName = string;
