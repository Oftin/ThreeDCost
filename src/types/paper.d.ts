import { MD3Colors, MD3Theme } from "react-native-paper";

declare module "react-native-paper" {
  interface MD3Colors {
    success: string;
    onSuccess: string;
  }

  interface MD3Theme {
    colors: MD3Colors;
  }
}
