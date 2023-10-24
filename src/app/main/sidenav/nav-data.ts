import { INavbarData } from "./helper";

export const navbarData: INavbarData[] = [
  {
    routeLink: 'requests',
    icon: 'search',
    label: 'Заявления',
    expanded: true,
    items: [
      {
        routeLink: 'requests/new',
        label: 'Новые'
      },
      {
        routeLink: 'requests/inprocess',
        label: 'В обработке'
      },
      {
        routeLink: 'requests/complite',
        label: 'Завершено',
        items: [
          {
            routeLink: 'requests/new',
            label: 'Новые'
          },
          {
            routeLink: 'requests/inprocess',
            label: 'В обработке'
          },
          {
            routeLink: 'requests/complite',
            label: 'Завершено',

          }

        ]
      }

    ]
  },
  {
    routeLink: 'admin',
    icon: 'group',
    label: 'Администрирование'
  },
  {
    routeLink: 'settings',
    icon: 'settings',
    label: 'Настройки'
  },

];
