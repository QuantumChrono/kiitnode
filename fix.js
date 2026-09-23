const fs = require('fs');
let code = fs.readFileSync('src/context/AuthContext.tsx', 'utf8');
code = code.replace(
`      const { data, error } = await supabase
        (supabase as any).from('profiles')`,
`      const { data, error } = await supabase
        .from('profiles')`
);
fs.writeFileSync('src/context/AuthContext.tsx', code);
