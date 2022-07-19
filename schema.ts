import { list } from '@keystone-6/core';

import {
  text,
  relationship,
  password,
  timestamp,
  select,
  image,
  integer,
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

import { Lists } from '.keystone/types';

export const lists: Lists = {
  User: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      description : text({
        ui : {
          displayMode : 'textarea'
        }
      }),
      phoneNumber : text(),
      role : select({
        options : [
          { label: 'Pasien', value: 'pasien' },
          { label: 'Dokter', value: 'dokter' },
          { label: 'Admin', value: 'admin' },
        ]
      }),
      photoProfile : image({ storage: 'my_local_images' }),
      department : relationship({
        ref: 'Department.user',
        ui: {
          displayMode: 'select',
          createView : {
            fieldMode : 'edit'
          },
          hideCreate : false,
          itemView : {
            fieldMode : 'edit'
          },
          listView : {
            fieldMode : 'read'
          },
        },
      }),
      password: password({ validation: { isRequired: true } }),
    },
    ui: {
      listView: {
        initialColumns: ['name', 'email', 'role', 'department'],
      },
    },
  }),
  Department : list({
    fields : {
      name : text(),
      user : relationship({
        ref : 'User.department',
        many : true
      })
    }
  }),
  Appointment : list({
    fields : {
      department : relationship({
        ref : "Department",
        many : true
      }),
      doctor : relationship({
        ref : "User",
        many : false
      }),
      pasien : relationship({
        ref : "User",
        many : false
      }),
      catatanKeluhan : text(),
      start : timestamp(),
      end : timestamp(),
      grandTotal : integer(),
    }
  }),
};
