/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/pj1_counter.json`.
 */
export type Pj1Counter = {
  address: "9ivQ9UkUpATDYmhBxVwjXTMPvbnd32bzReqQhvZKamEF";
  metadata: {
    name: "pj1Counter";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "decrement";
      discriminator: [106, 227, 168, 59, 248, 27, 150, 101];
      accounts: [
        {
          name: "counter";
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: "increment";
      discriminator: [11, 18, 104, 9, 104, 174, 59, 33];
      accounts: [
        {
          name: "counter";
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: "initialize";
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: "counter";
          writable: true;
          signer: true;
        },
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "update";
      discriminator: [219, 200, 88, 176, 158, 63, 253, 127];
      accounts: [
        {
          name: "counter";
          writable: true;
        }
      ];
      args: [
        {
          name: "data";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "counter";
      discriminator: [255, 176, 4, 245, 188, 253, 124, 25];
    }
  ];
  types: [
    {
      name: "counter";
      type: {
        kind: "struct";
        fields: [
          {
            name: "count";
            type: "u64";
          }
        ];
      };
    }
  ];
};

export const IDL: Pj1Counter = {
  address: "9ivQ9UkUpATDYmhBxVwjXTMPvbnd32bzReqQhvZKamEF",
  metadata: {
    name: "pj1Counter",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "decrement",
      discriminator: [106, 227, 168, 59, 248, 27, 150, 101],
      accounts: [
        {
          name: "counter",
          writable: true,
        },
      ],
      args: [],
    },
    {
      name: "increment",
      discriminator: [11, 18, 104, 9, 104, 174, 59, 33],
      accounts: [
        {
          name: "counter",
          writable: true,
        },
      ],
      args: [],
    },
    {
      name: "initialize",
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        {
          name: "counter",
          writable: true,
          signer: true,
        },
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
    {
      name: "update",
      discriminator: [219, 200, 88, 176, 158, 63, 253, 127],
      accounts: [
        {
          name: "counter",
          writable: true,
        },
      ],
      args: [
        {
          name: "data",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "counter",
      discriminator: [255, 176, 4, 245, 188, 253, 124, 25],
    },
  ],
  types: [
    {
      name: "counter",
      type: {
        kind: "struct",
        fields: [
          {
            name: "count",
            type: "u64",
          },
        ],
      },
    },
  ],
};
