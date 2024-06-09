"use client"

import {Button, Dropdown, Link, Navbar, Switch, Text} from '@nextui-org/react';
import React from 'react';
import {useTheme as useNextTheme} from 'next-themes';
import {useTheme} from '@nextui-org/react';
import { icons } from '@/styles/icons';
import NextLink   from 'next/link';

export const Nav = () => {
   const {setTheme} = useNextTheme();
   const {isDark, type} = useTheme();
   const collapseItems = [
      'Features',
      'Playground'
   ];
   return (
      <Navbar
         isBordered
         css={{
            'overflow': 'hidden',
            '& .nextui-navbar-container': {
               background: '$background',
               borderBottom: 'none',
            },
         }}
      >
         <Navbar.Brand>
            <Navbar.Toggle aria-label="toggle navigation" showIn="xs" />
            <NextLink href={"/"}>

            <Text b color="inherit" hideIn="xs">
               To JSON
            </Text>
            </NextLink>
            <Navbar.Content
               hideIn="sm"
               css={{
                  pl: '6rem',
               }}
            >
               <Dropdown>
                  <Navbar.Item>
                     <Dropdown.Button
                        auto
                        light
                        css={{
                           px: 0,
                           dflex: 'center',
                           svg: {pe: 'none'},
                        }}
                        iconRight={icons.chevron}
                        ripple={false}
                     >
                        Features
                     </Dropdown.Button>
                  </Navbar.Item>
                  <Dropdown.Menu
                     aria-label="features"
                     css={{
                        '$$dropdownMenuWidth': '340px',
                        '$$dropdownItemHeight': '70px',
                        '& .nextui-dropdown-item': {
                           'py': '$4',
                           'svg': {
                              color: '$secondary',
                              mr: '$4',
                           },
                           '& .nextui-dropdown-item-content': {
                              w: '100%',
                              fontWeight: '$semibold',
                           },
                        },
                     }}
                  >
                     <Dropdown.Item
                        key="time-effective"
                        showFullDescription
                        description="Save time and focus on your work. We’ll take care of the types."
                        icon={icons.scale}
                     >
                        Time Effective
                     </Dropdown.Item>
                     <Dropdown.Item
                        key="open-source"
                        showFullDescription
                        description="To JSON is open source, and we’d love for you to join us."
                        icon={icons.activity}
                     >
                        Open Source
                     </Dropdown.Item>
                     <Dropdown.Item
                        key="production_ready"
                        showFullDescription
                        description="To JSON is production-ready, and compatible with any framework."
                        icon={icons.server}
                     >
                        Production Ready
                     </Dropdown.Item>
                     <Dropdown.Item
                        key="lighting-fast-response"
                        showFullDescription
                        description="To JSON provides lighting-fast responses to your requests."
                      
                         icon={icons.flash}
                     >
                        Lighting-fast
                     </Dropdown.Item>
                     <Dropdown.Item
                        key="easy_to_use"
                        showFullDescription
                        description="To JSON is easy to use, and you can get started in minutes."
                        icon={icons.user}
                     >
                        Easy to Use
                     </Dropdown.Item>
                  </Dropdown.Menu>
               </Dropdown>
               <NextLink href="/playground">Playground</NextLink>
               
            </Navbar.Content>
         </Navbar.Brand>

         <Navbar.Collapse>
            {collapseItems.map((item, index) => (
               <Navbar.CollapseItem key={item}>
                  <Link
                     color="inherit"
                     css={{
                        minWidth: '100%',
                     }}
                     href="#"
                  >
                     {item}
                  </Link>
               </Navbar.CollapseItem>
            ))}
            <Navbar.CollapseItem>
               <Switch
                  checked={isDark}
                  onChange={(e: any) =>
                     setTheme(e.target.checked ? 'dark' : 'light')
                  }
               />
            </Navbar.CollapseItem>
         </Navbar.Collapse>
         <Navbar.Content>
        

            <Navbar.Item>
               <Button auto flat href="https://github.com/piyushyadav0191/To-JSON">
               ⭐ Github
               </Button>
            </Navbar.Item>
            <Navbar.Item hideIn={'xs'}>
               <Switch
                  checked={isDark}
                  onChange={(e: any) =>
                     setTheme(e.target.checked ? 'dark' : 'light')
                  }
               />
            </Navbar.Item>
         </Navbar.Content>
      </Navbar>
   );
};
