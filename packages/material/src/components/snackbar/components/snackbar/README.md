A `<MaterialSnackbar>` is rendered by calling the function `showSnack`:

```typescript
showSnack({
  text: 'Supporting text',
  dismissable: true
});
```

An action can be provided by specifying the `action` property:

```typescript
showSnack({
  text: 'Supporting text',
  action: {
    label: 'Action',
    onClick: () => console.info('Clicked action')
  }
});
```

The `duration` property specifies how long the snackbar will remain visible if it is not dismissable:

- `short` (4 seconds, default if no action is provided)
- `long` (10 seconds, default if an action is provided)
- `indefinite`
