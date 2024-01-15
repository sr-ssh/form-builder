import { useView } from "../../hooks/useView";

export interface MenuConfig {
  options: MenuOption[];
}

export interface MenuOption {
  text: string;
  value: string;
}

export function Overlay() {
  const { close, viewData } = useView<MenuConfig>({});
  return (
    <ul className="d-block bg-primary p-2 text-lite">
      {viewData.options.map((item: MenuOption) => (
        <li
          key={item.text}
          onClick={() => {
            close({
              res: item.value,
            });
          }}
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
}
