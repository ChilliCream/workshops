using System.Collections;
using CommunityToolkit.Mvvm.ComponentModel;

namespace MauiCrypto;

[INotifyPropertyChanged]
public abstract partial class BaseViewModel
{
}

public static class ViewModelExtensions
{
	public static bool IsNullOrEmpty(this IEnumerable? enumerable) => !enumerable?.GetEnumerator().MoveNext() ?? true;
}